import { input } from '@inquirer/prompts'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'

export const createActor = async (sourcePath: string) => {
  const name = await input({ message: '名前を入力してください' }, { clearPromptOnDone: true })
  const description = await input({ message: '説明を入力してください' }, { clearPromptOnDone: true })

  const yaml = new Yaml(sourcePath)
  const rdra = RDRA.from(yaml.getModel())
  const errors = rdra.addActor(name, description)
  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(error)
    })
    return
  }
  Yaml.export(sourcePath, rdra.toJSON())
  console.log('Actorを追加しました。名前:' + name, '説明:' + description)
}
