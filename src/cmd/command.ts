import { BaseBuilder, BaseHandler } from './util/types'
import { Yaml } from '../util/Yaml'
import { ErrorCollector } from '../util/ErrorCollector'
import { error } from './output/console'
import { checkFileExists, getSourcePath } from './util/options'
import select from '@inquirer/select'
import { selectActorMenu } from './commands/actor'


export const command = 'command'
export const desc = 'Choose a command to execute'


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
  const yaml = new Yaml(sourcePath)
  errors = yaml.validate()
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  const model = yaml.getModel()
  errors = ErrorCollector.collect(model)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // Show commands
  selectMenu(sourcePath)

}

export const selectMenu = async (sourcePath: string) => {
  const menu = ['actor', 'division', 'buc', 'activity', 'usecase', 'state', 'view', 'information', 'overview', 'Quit']
  const selected = await select({
      message: 'Please Select',
      choices: menu.map(layer => ({ name: layer, value: layer })),
      pageSize: 5,
    },
    {
      clearPromptOnDone: true,
    })
  switch (selected) {
    case 'actor':
      await selectActorMenu(sourcePath)
      break
    case 'division':
      break
    case 'buc':
      break
    case 'activity':
      break
    case 'usecase':
      break
    case 'state':
      break
    case 'view':
      break
    case 'information':
      break
    case 'overview':
      break
    default:
      process.exit(0)
      break
  }

  await selectMenu(sourcePath)
}
