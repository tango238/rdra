import { input } from '@inquirer/prompts'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'
import { list } from './list'

export const updateActor = async (sourcePath: string) => {
  const selected = await list(sourcePath)
  const newName = await input({ message: '名前を入力してください' }, { clearPromptOnDone: true })
  const newDescription = await input({ message: '説明を入力してください' }, { clearPromptOnDone: true })
  if (!newName) {
    console.log('名前は必須です。')
    return
  }

  const yaml = new Yaml(sourcePath)
  const rdra = RDRA.from(yaml.getModel())
  const errors = rdra.updateActor(selected, newName, newDescription)
  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(error)
    })
    return
  }
  Yaml.export(sourcePath, rdra.toJSON())
  console.log('Actorを更新しました。名前:' + newName, '説明:' + newDescription)
}
