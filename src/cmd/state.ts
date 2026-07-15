import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { outputAllState } from './output/state'

export const command = 'state [value]'
export const desc = 'Show list of states and its transitions'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)

export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { model } = loadValidatedModel(file, value)

  // ------------------------------
  // State
  outputAllState(model)
}
