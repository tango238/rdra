import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { runMenu } from './util/menu'
import { selectActorMenu } from './commands/actor'


export const command = 'command'
export const desc = 'Choose a command to execute'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { sourcePath } = loadValidatedModel(file, value)

  // Show commands
  selectMenu(sourcePath)
}

const CommandMenu = {
  actor: 'actor',
  division: 'division',
  buc: 'buc',
  activity: 'activity',
  usecase: 'usecase',
  state: 'state',
  view: 'view',
  information: 'information',
  overview: 'overview',
  quit: 'Quit',
}


export const selectMenu = async (sourcePath: string): Promise<void> => {
  await runMenu([
    { label: CommandMenu.actor, action: () => selectActorMenu(sourcePath) },
    { label: CommandMenu.view, action: () => {} },
    { label: CommandMenu.quit, action: () => process.exit(0) },
  ])

  await selectMenu(sourcePath)
}
