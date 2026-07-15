import { UcBuilder, UcHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { error } from './output/console'
import { outputAllUseCases } from './output/usecase'

export const command = 'usecase [value]'
export const desc = 'Show list of usecase'


export const builder: UcBuilder = (yargs) =>
  createSourceBuilder(yargs)
    .options({
      buc: { type: 'string', alias: 'b' }
    })


export const handler: UcHandler = async (argv) => {
  const { file, value, buc } = argv
  const { model } = loadValidatedModel(file, value)

  // Check
  if (buc && !model.business) {
    error(`BUCが未定義です。[${buc}]`)
    process.exit(1)
  }
  else if (buc && model.business && !model.business.instances.flatMap(it => it.buc.flatMap(b => b.name)).includes(buc)) {
    error(`引数に指定されているBUCが見つかりません。[${buc}]`)
    process.exit(1)
  }

  outputAllUseCases(model, buc)
}
