import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { outputAllView } from './output/view'

export const command = 'view [value]'
export const desc = 'Show list of views'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { model } = loadValidatedModel(file, value)

  // ------------------------------
  // View
  outputAllView(model)
}
