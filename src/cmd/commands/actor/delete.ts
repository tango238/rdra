import { list } from './list'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'
import { ErrorCollector } from '../../../util/ErrorCollector'

export const deleteActor = async (sourcePath: string) => {
  const selected = await list(sourcePath)
  const yaml = new Yaml(sourcePath)
  const rdra = RDRA.from(yaml.getModel())
  rdra.deleteActor(selected)

  const json = rdra.toJSON()
  const err = ErrorCollector.printJsonErrors(json)
  if (err) return

  Yaml.export(sourcePath, json)
  console.log('Actorを削除しました。名前:' + selected)
}
