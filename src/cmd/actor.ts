import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { outputAllActors } from './output/actor'

export const command = 'actor [value]'
export const desc = 'Show list of actor/internal/external'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { model } = loadValidatedModel(file, value)

  outputAllActors(model)
}
