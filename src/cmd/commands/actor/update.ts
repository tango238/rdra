import { input } from '@inquirer/prompts'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'
import { list } from './list'
import { ErrorCollector } from '../../../util/ErrorCollector'

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
  rdra.updateActor(selected, newName, newDescription)

  const json = rdra.toJSON()
  const err = ErrorCollector.printJsonErrors(json)
  if (err) return

  Yaml.export(sourcePath, json)
  console.log('Actorを更新しました。名前:' + newName, '説明:' + newDescription)
}
