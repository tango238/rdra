import type { Argv } from 'yargs'
import { Yaml } from '../../util/Yaml'
import { RelationalModel } from '../../model/RDRA'
import { ErrorCollector } from '../../util/ErrorCollector'
import { error } from '../output/console'
import { checkFileExists, getSourcePath } from './options'
import { BaseOptions } from './types'

export type ValidatedModel = {
  sourcePath: string
  model: RelationalModel
}

/**
 * Applies the `file`/`value` source options shared by every model-reading
 * command (positional `value`, `--file`/`-f` alias, existence check).
 */
export const createSourceBuilder = <T extends BaseOptions>(yargs: Argv<T>): Argv<T> =>
  yargs
    .options({
      file: { type: 'string', alias: 'f', conflicts: 'value' }
    })
    .positional('value', { type: 'string' })
    .check((argv, _options) => {
      const { file, value } = argv
      checkFileExists(file, value)
      return argv
    }) as unknown as Argv<T>

const printErrorsAndExit = (errors: string[]): never => {
  errors.forEach(err => error(err))
  process.exit(1)
}

/**
 * Resolves the source path, parses+validates the YAML, and loads the
 * RDRA model, exiting the process with the collected errors if either
 * step fails.
 */
export const loadValidatedModel = (file: string | undefined, value: string | undefined): ValidatedModel => {
  const sourcePath = getSourcePath(file, value)

  const yaml = new Yaml(sourcePath)
  const validationErrors = yaml.validate()
  if (validationErrors.length > 0) {
    printErrorsAndExit(validationErrors)
  }

  const model = yaml.getModel()
  const modelErrors = ErrorCollector.collect(model)
  if (modelErrors.length > 0) {
    printErrorsAndExit(modelErrors)
  }

  return { sourcePath, model }
}
