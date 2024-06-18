import { list } from './list'
import { Yaml } from '../../../util/Yaml'
import { RDRA } from '../../../model/RDRA'

export const deleteActor = async (sourcePath: string) => {
  const selected = await list(sourcePath)
  const yaml = new Yaml(sourcePath)
  const rdra = RDRA.from(yaml.getModel())
  const errors = rdra.deleteActor(selected)
  if (errors.length > 0) {
    errors.forEach((error) => {
      console.log(error)
    })
    return
  }
  Yaml.export(sourcePath, rdra.toJSON())
  console.log('Actorを削除しました。名前:' + selected)
}
