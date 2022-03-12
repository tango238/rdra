import { UcBuilder, UcHandler } from './util/types'
import { checkFileExists, getSourcePath } from './util/options'
import { Yaml } from '../util/Yaml'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { error } from './output/console'
import { outputAllUseCases } from './output/usecase'

export const command = 'usecase [value]'
export const desc = 'Show list of usecase'


export const builder: UcBuilder = (yargs) =>
  yargs
    .options({
      file: { type: 'string', alias: 'f', conflicts: 'value' },
      buc: { type: 'string', alias:'b' }
    })
    .positional('value', { type: 'string' })
    .check((argv, _options) => {
      const { file, value } = argv
      checkFileExists(file, value)
      return argv
    })


export const handler: UcHandler = async (argv) => {
  const { file, value, buc } = argv
  const sourcePath = getSourcePath(file, value)
  let errors = []

  // Parse YAML
  const yaml = new Yaml()
  const input = yaml.load(sourcePath)
  errors = yaml.validate(input)
  if (errors.length > 0) {
    console.log(errors)
    process.exit(1)
  }

  // RDRA Model
  const rdra = new RDRA()
  const model = rdra.resolve(input)
  errors = ErrorCollector.collect(model)
  if (errors.length > 0) {
    console.log(errors)
    process.exit(1)
  }

  // Check
  if (buc && !model.business) {
    error("BUCが未定義です。[${buc}]")
    process.exit(1)
  }
  else if (buc && model.business && !model.business.instances.flatMap(it => it.buc.flatMap(b => b.name)).includes(buc)) {
    error(`引数に指定されているBUCが見つかりません。[${buc}]`)
    process.exit(1)
  }

  outputAllUseCases(model, buc)
}