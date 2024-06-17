import { input } from '@inquirer/prompts'
import { RDRA } from '../../model/RDRA'
import { Overview } from '../../model/actor/Overview'
import { Actor } from '../../model/actor/Actor'
import { Yaml } from '../../util/Yaml'

export const initialize = async (sourcePath: string) => {
  const business = await input({ message: 'ビジネス領域を入力してください' })
  const system = await input({ message: 'システム名を入力してください' })
  const actors = await input({ message: 'システムの利用者を入力してください（カンマで複数入力）' })

  const model = new RDRA(
    Overview.create(business, system),
    Actor.create(
      actors.split(',')
        .map((name: string) => {
          return { name: name.trim() }
        })
    )
  )
  Yaml.export(sourcePath, model.toJSON())
}
