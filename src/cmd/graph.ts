import * as fs from 'fs'
import { BaseBuilder, BaseHandler } from './util/types'
import { checkFileExists, getSourcePath } from './util/options'
import { Yaml } from '../util/Yaml'
import { error } from './output/console'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { StateGroup } from '../model/state/StateTransition'
import { heredoc } from '../util/heredoc'
import { Buc, Business } from '../model/business/Business'
import vizRenderStringSync from '@aduh95/viz.js/sync'
import { Actor } from '../model/actor/Actor'
import { ExternalActor } from '../model/actor/ExternalActor'
import { Usecase } from '../model/usecase/Usecase'
import { Information } from '../model/information/Information'

export const command = 'graph [value]'
export const desc = 'Generate relational graphs'

export const builder: BaseBuilder = (yargs) =>
  yargs
    .options({
      file: { type: 'string', alias: 'f', conflicts: 'value' }
    })
    .positional('value', { type: 'string' })
    .check((argv, _options) => {
      const { file, value } = argv
      checkFileExists(file, value)
      return argv
    })


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const sourcePath = getSourcePath(file, value)
  let errors = []

  // Parse YAML
  const yaml = new Yaml()
  const input = yaml.load(sourcePath)
  errors = yaml.validate(input)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // RDRA Model
  const rdra = new RDRA()
  const model = rdra.resolve(input)
  errors = ErrorCollector.collect(model)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // ------------------------------
  // Output Directory
  if (!fs.existsSync('output')) {
    fs.mkdirSync(`output`)
  }

  // ------------------------------
  // Business Context
  if (model.business) {
    outputBusinessContext(model.overview.business, model.business, model.actor, model.externalActor)
  }

  // ------------------------------
  // Workflow
  if (model.business) {
    model.business.instances.forEach(b => {
      b.buc.forEach(buc => {
        outputWorkflow(buc, model.usecase)
      })
    })
  }

  // ------------------------------
  // Information
  if (model.information) {
    outputInformation(model.information)
  }

  // ------------------------------
  // State Transition
  if (model.transition) {
    model.transition.instances.forEach(group => {
      outputStateTransition(group)
    })
  }
}

const outputBusinessContext = (businessName: string, business: Business, actor: Actor, externalActor: ExternalActor | null) => {
  const names = business.names.map(n => `"${n}" [shape = box3d, fontsize = "11pt", color = "#0000ff"];`)
  const actors = actor.names.map(a => `"${a}" [shape = plaintext, fontsize = "9pt"];`)
  const externalActors = externalActor ? externalActor.names.map(a => `"${a}" [shape = plaintext, fontsize = "9pt"];`) : []
  const edges = business.instances.flatMap(b =>
    b.main.map(actor =>
      `"${actor}" -> "${b.name}" [arrowhead = none];`
    )
  )

  const biz = business.instances.map((biz, index) =>
    heredoc`
    subgraph cluster_b${index + ''} {
      label = "";
      "${biz.name}";
      
      ${biz.buc.map(buc => `"${buc.name}" [fontsize = "9pt", shape = oval, style="filled", fillcolor = "#ff99cc"]`).join('\n;')}
    }
  `
  )

  const code = heredoc`
digraph G {
  layout = fdp;
  charset = "UTF-8";
  label = "ビジネスコンテキスト図";
  rankdir = TB;

  subgraph cluster_0 {
      label = "${businessName}";
      style=solid;

      ${biz.join('\n')};
      ${actor.names.join(';\n')};
  }

  ${names.join('\n')}
  ${actors.join('\n')}
  ${externalActors.join('\n')}
  ${edges.join('\n')}
}`
  // console.log(code)

  fs.writeFileSync(`output/BusinessContext.svg`, vizRenderStringSync(code))
}

const outputWorkflow = (buc: Buc, usecase: Usecase | null) => {
  if (buc.activity.length == 0) {
    console.log(`[${buc.name}]アクティビティが登録されていません。`)
    return
  }

  const start = buc.activity[0]?.name ?? 'start'
  const activities = buc.activity.map(act => `"${act.name}"`)

  const activityUsedBy = buc.activity.flatMap(act =>
    act.used_by.map(usedBy => {
        return {
          actor: usedBy,
          activity_actor: `${act.name}_${usedBy}`,
          activity: act.name,
          usecase: act.usecase
        }
      }
    ))

  // make edges to be unique
  const edges = [...new Set(activityUsedBy.flatMap(a => a.usecase?.map(uc => `"${a.activity}" -> "${uc}"  [dir = none];`)))]
  const ucNames = (buc.activity.filter(act => act.usecase).flatMap(act => act.usecase)) as string[]
  const ucCode = usecase ? outputUsecase(usecase, ucNames) : ""

  const code = heredoc`
digraph {
  layout = dot;
  rankdir = LR;
  label = "${buc.name}";
    
  start [shape = point];
  start -> ${start} [dir = none];

  // node actor
  ${activityUsedBy.map(a => `"${a.activity_actor}" [label = "${a.actor}"];`).join('\n')}
  
  // node activity
  ${activities.map(activity => `${activity} [shape = box];`).join('\n')}
  
  // node usecase
  ${ucNames.map(uc => `"${uc}" [shape = none];`).join('\n')}
  
  // edge [activity]
  ${activities.join(' -> ')};

  // edge actor -> activity
  ${activityUsedBy.map(a => `"${a.activity_actor}" -> "${a.activity}"  [dir = none, style = dashed];`).join('\n')}

  // edge activity -> usecase
  ${edges.join('\n')}
  
  // usecase -> view, information, condition
  ${ucCode}
  
  {rank = same; start; ${activities.join(';')};}
  {rank = same; ${ucNames.join(';')}}
  {rank = same; ${activityUsedBy.map(a => `"${a.activity_actor}"`).join(';')}}
}`

  // console.log(code)
  fs.writeFileSync(`output/wf_${buc.name}.svg`, vizRenderStringSync(code))
}


const outputUsecase = (usecase: Usecase, names: string[]) => {

  const ucs = usecase.instances.filter(uc => names.includes(uc.name))

  // uc -> view
  const ucView = [...new Set(ucs.filter(uc => uc.view).flatMap(uc => uc.view?.map(view => `"${uc.name}" -> "画面\n${view}" [dir = none];`)))]
  // uc -> information
  const ucInfo = [...new Set(ucs.filter(uc => uc.information).flatMap(uc => uc.information?.map(info => `"${uc.name}" -> "情報\n${info}" [dir = none];`)))]
  // uc -> condition
  const ucCond = [...new Set(ucs.filter(uc => uc.condition).flatMap(uc => uc.condition?.map(cond => `"${uc.name}" -> "条件\n${cond}" [dir = none];`)))]

  return heredoc`
    ${ucView.join('\n')}
    ${ucInfo.join('\n')}
    ${ucCond.join('\n')}
  `
}

const outputInformation = (information: Information) => {
  const graph = information.contexts().map((ctx, idx) => {
    const edges = ctx[1].map(edge => edge.related.length > 0 ? `${edge.name} -> ${edge.related} [dir = none]` : `${edge.name};`)
    return heredoc`
      subgraph cluster_${idx + ''} {
        label = "${ctx[0]}";
        
        ${edges.join('\n')}
      }
    `
  })

  const code = heredoc`
digraph {
  layout = fdp;
  rankdir = LR;
  label = "情報";

  ${graph.join('\n')}
}
  `

  fs.writeFileSync(`output/information.svg`, vizRenderStringSync(code))
}

const outputStateTransition = (group: StateGroup) => {
  let stateDiagram: string[] = []
  group.values.forEach(value => {
    value.usecase?.forEach(uc => {
      stateDiagram.push(`  ${value.name} -> ${uc.nextState} [label = "${uc.name}"];`)
    })
  })
  const edges = stateDiagram.join('\n')
  const code = heredoc`
digraph {
  graph [
    charset = "UTF-8";
    label = "${group.name}"
  ];
  node [
    shape = box
  ];
   
  edge [
    fontsize = 9
  ];

${edges}
}`

  fs.writeFileSync(`output/st_${group.name}.svg`, vizRenderStringSync(code))
}