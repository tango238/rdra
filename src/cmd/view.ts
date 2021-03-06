import { BaseBuilder, BaseHandler } from './util/types'
import { checkFileExists, getSourcePath } from './util/options'
import { Yaml } from '../util/Yaml'
import { br, error, info, title } from './output/console'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import tableB, { table } from 'table-b'
import invariant from 'tiny-invariant'
import { outputAllView } from './output/view'

export const command = 'view [value]'
export const desc = 'Show list of views'


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
  // View
  outputAllView(model)
}