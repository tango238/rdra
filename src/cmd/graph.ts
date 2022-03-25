import * as fs from 'fs'
import { BaseBuilder, BaseHandler } from './util/types'
import { checkFileExists, getSourcePath } from './util/options'
import { Yaml } from '../util/Yaml'
import { error } from './output/console'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { StateGroup } from '../model/state/StateTransition'
import { heredoc } from '../util/heredoc'
import { Business } from '../model/business/Business'
import vizRenderStringSync from '@aduh95/viz.js/sync'
import { Actor } from '../model/actor/Actor'
import { ExternalActor } from '../model/actor/ExternalActor'

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
  // State Transition
  if (model.transition) {
    model.transition.instances.forEach(group => {
      outputStateTransition(group)
    })
  }
}

const outputBusinessContext = async (businessName: string, business: Business, actor: Actor, externalActor: ExternalActor | null) => {
  const names = business.names.map(n => `${n} [shape = box3d];`)
  const actors = actor.names.map(a => `${a} [fontsize = "9pt"];`)
  const externalActors = externalActor ? externalActor.names.map(a => `${a} [fontsize = "9pt"];`) : [];
  const edges = business.instances.flatMap(b =>
    b.main.map(actor =>
      `${actor} -> ${b.name} [arrowhead = none];`
    )
  )

  const code = heredoc`
digraph G {
  graph [
      charset = "UTF-8";
      layout = fdp;
      label = "ビジネスコンテキスト図"
  ]

  subgraph cluster_0 {
      label = "${businessName}";
      style=solid;
      ${business.names.join(';\n')};
      ${actor.names.join(';\n')};
  }

  ${names.join('\n')}
  ${actors.join('\n')}
  ${externalActors.join('\n')}
  ${edges.join('\n')}
}`

  // console.log(code)
  fs.writeFileSync(`output/business.svg`, vizRenderStringSync(code))
}

const outputStateTransition = async (group: StateGroup) => {
  const vizRenderStringSync = require("@aduh95/viz.js/sync")

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

  fs.writeFileSync(`output/${group.name}.svg`, vizRenderStringSync(code))
}