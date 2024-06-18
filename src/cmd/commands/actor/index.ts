import { createActor } from './create'
import select from '@inquirer/select'
import { selectMenu } from '../../command'
import { Yaml } from '../../../util/Yaml'
import { Actor } from '../../../model/actor/Actor'
import { showActor } from './show'
import { updateActor } from './update'
import { deleteActor } from './delete'

export const actorCommands = {
  create: {
    command: createActor,
    description: 'Create a new actor',
  }
  ,
  show: {
    command: showActor,
    description: 'Show an actor',
  },
  update: {
    command: updateActor,
    description: 'Update an actor',
  },
  delete: {
    command: deleteActor,
    description: 'Delete an actor',
  }
}

class Row {
  constructor(public name: string, public description: string | undefined) {
    this.name = name as string
    this.description = description
  }
}

function tableView(actor: Actor) {
  console.table(actor.instances.map(it => new Row(it.name, it.description)))
}

export const selectActorMenu = async (sourcePath: string) => {
  const yaml = new Yaml(sourcePath)
  const actor = yaml.getModel().actor
  tableView(actor)

  const menu = [actorCommands.create.description]
  if (actor.instances.length > 0) {
    menu.push(
      actorCommands.show.description,
      actorCommands.update.description,
      actorCommands.delete.description
    )
  }
  menu.push('Go back', 'Quit')

  const selected = await select({
      message: 'Please Select',
      choices: menu.map(m => ({ name: m, value: m })),
      pageSize: 3
    },
    {
      clearPromptOnDone: true,
    })
  switch (selected) {
    case actorCommands.create.description:
      await actorCommands.create.command(sourcePath)
      await selectActorMenu(sourcePath)
      break
    case actorCommands.show.description:
      await actorCommands.show.command(sourcePath)
      await selectActorMenu(sourcePath)
      break
    case actorCommands.update.description:
      await actorCommands.update.command(sourcePath)
      await selectActorMenu(sourcePath)
      break
    case actorCommands.delete.description:
      await actorCommands.delete.command(sourcePath)
      await selectActorMenu(sourcePath)
      break
    case 'Go back':
      await selectMenu(sourcePath)
      break
    default:
      process.exit(0)
      break
  }
}
