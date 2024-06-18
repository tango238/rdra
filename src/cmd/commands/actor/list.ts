import select from '@inquirer/select'
import { Yaml } from '../../../util/Yaml'

export const list = (sourcePath: string) => {
  return select({
      message: 'Select an actor',
      choices: new Yaml(sourcePath).getModel().actor.names.map(it => ({ name: it, value: it })),
    },
    {
      clearPromptOnDone: true,
    })
}

