import { input } from '@inquirer/prompts'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'
import { ErrorCollector } from '../../../util/ErrorCollector'

export const createActor = async (sourcePath: string) => {
  const name = await input({ message: '名前を入力してください' }, { clearPromptOnDone: true })
  const description = await input({ message: '説明を入力してください' }, { clearPromptOnDone: true })

  const yaml = new Yaml(sourcePath)
  const rdra = RDRA.from(yaml.getModel())
  rdra.addActor(name, description)

  const json = rdra.toJSON();
  const err = ErrorCollector.printJsonErrors(json)
  if (err) return

  Yaml.export(sourcePath, json)
  console.log('Actorを追加しました。名前:' + name, '説明:' + description)
}
