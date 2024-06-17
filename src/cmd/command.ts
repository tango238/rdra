import { BaseBuilder, BaseHandler } from './util/types'
import { Yaml } from '../util/Yaml'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { error } from './output/console'
import { checkFileExists, getSourcePath } from './util/options'
import { outputAllActors } from './output/actor'
import { outputAllUseCases } from './output/usecase'
import { outputAllState } from './output/state'
import { outputAllView } from './output/view'
import select from '@inquirer/select'


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
  const yaml = new Yaml()
  const source = yaml.load(sourcePath)
  errors = yaml.validate(source)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // RDRA Model
  const model = RDRA.resolve(source)
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

const selectMenu = async (sourcePath:string) => {
  const yaml = new Yaml()
  const source = yaml.load(sourcePath)
  const model = RDRA.resolve(source)
  const layers = ['actor', 'division', 'buc', 'activity', 'usecase', 'state', 'view', 'information', 'overview', 'QUIT']
  const selected = await select({
    message: 'Please Select',
    choices: layers.map(layer => ({ name: layer, value: layer })),
    pageSize: 3
  })
  switch (selected) {
    case 'actor':
      outputAllActors(model)
      await selectMenu(sourcePath)
      break
    case 'buc':
      await selectMenu(sourcePath)
      break
    case 'activity':
      await selectMenu(sourcePath)
      break
    case 'usecase':
      outputAllUseCases(model)
      await selectMenu(sourcePath)
      break
    case 'state':
      outputAllState(model)
      await selectMenu(sourcePath)
      break
    case 'view':
      outputAllView(model)
      await selectMenu(sourcePath)
      break
    case 'information':
      await selectMenu(sourcePath)
      break
    case 'overview':
    // const overview = new Overview(model)
    // overview.output()
    // break
    default:
      exit();
      break
  }

}

const exit = () => {
  process.exit(0)
}

type Command = {
  id: string;
  name: string;
  args?: string[];
  exec: () => void;
}

type Choice = {
  value: string;
  command_id: string;
};

// const selectLayer = async () => {
//   const layers = ['init', 'actor', 'division', 'buc', 'activity', 'usecase', 'state', 'view', 'information', 'overview', 'quit']
//   return select({
//     message: 'Please Select',
//     choices: layers.map(layer => ({ name: layer, value: layer }))
//   })
//
// }

// const layers = [
//   'actor', 'business', 'buc', 'activity', 'usecase', 'state', 'view', 'information', 'overview'
// ]

// const availableCommands: Command[] =
