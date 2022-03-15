import { BaseBuilder, BaseHandler } from './util/types'
import { Yaml } from '../util/Yaml'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { error, info, title } from './output/console'
import { checkFileExists, getSourcePath } from './util/options'
import { table } from 'table-b'
import chalk from 'chalk'

export const command = 'information [value]'
export const desc = 'Show a list of information'


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
  // Information
  title("情報")

  let rows: string[][] = []

  model.information.instances.map(info => {
    rows.push([info.name, info.description ?? '-', info.related.join(', '), info.variation])
  })

  rows.unshift([
    chalk.green('[情報名]'),
    chalk.green('[説明]'),
    chalk.green('[関連]'),
    chalk.green('[バリエーション]')
  ])
  info(table(rows))
}
