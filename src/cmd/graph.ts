import path from 'path'
import * as fs from 'fs'
import puppeteer from 'puppeteer'
import MermaidAPI from 'mermaid/mermaidAPI'
import { BaseBuilder, BaseHandler } from './util/types'
import { checkFileExists, getSourcePath } from './util/options'
import { Yaml } from '../util/Yaml'
import { error } from './output/console'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { StateGroup } from '../model/state/StateTransition'

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
  // State Transition
  if (model.transition) {
    model.transition.instances.forEach(group => {
      outputStateDiagram(group)
    })
  }
}

const outputStateDiagram = async (group:StateGroup) => {
  let stateDiagram:string[] = ['stateDiagram-v2']
 group.values.forEach(value => {
    value.usecase?.forEach(uc => {
      stateDiagram.push(`  ${value.name} --> ${uc.nextState}: ${uc.name}`)
    })
  })
  const code = stateDiagram.join('\n')
  await parseMermaid(code, `output/${group.name}.svg`)
}

const parseMermaid = async (code: string, output: string) => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(`file://${path.join(__dirname, '/mermaid/index.html')}`)
  const svg = await page.evaluate(async (code: string) => {
      const wnd = (window as any as Window & {
        mermaid: { mermaidAPI: typeof MermaidAPI }
      })
      wnd.mermaid.mermaidAPI.initialize({})

      return await new Promise<string>((ok) =>
        wnd.mermaid.mermaidAPI.render('render', code, ok))
    },
    code
  )
  await browser.close()
  //console.log(svg)
  fs.writeFileSync(output, svg)
}