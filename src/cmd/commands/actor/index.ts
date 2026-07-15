import { createActor } from './create'
import { selectMenu } from '../../command'
import { Yaml } from '../../../util/Yaml'
import { Actor } from '../../../model/actor/Actor'
import { showActor } from './show'
import { updateActor } from './update'
import { deleteActor } from './delete'
import { MenuItem, runMenu } from '../../util/menu'

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

export const selectActorMenu = async (sourcePath: string): Promise<void> => {
  const yaml = new Yaml(sourcePath)
  const actor = yaml.getModel().actor
  tableView(actor)

  const runAndReturn = (command: (sourcePath: string) => Promise<void>): MenuItem['action'] =>
    async () => {
      await command(sourcePath)
      await selectActorMenu(sourcePath)
    }

  const items: MenuItem[] = [
    { label: actorCommands.create.description, action: runAndReturn(actorCommands.create.command) },
  ]
  if (actor.instances.length > 0) {
    items.push(
      { label: actorCommands.show.description, action: runAndReturn(actorCommands.show.command) },
      { label: actorCommands.update.description, action: runAndReturn(actorCommands.update.command) },
      { label: actorCommands.delete.description, action: runAndReturn(actorCommands.delete.command) },
    )
  }
  items.push(
    { label: 'Go back', action: () => selectMenu(sourcePath) },
    { label: 'Quit', action: () => process.exit(0) },
  )

  await runMenu(items, 3)
}
