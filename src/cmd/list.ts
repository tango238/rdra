import chalk from 'chalk'
import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { title, info, br } from './output/console'
import { outputAllActors } from './output/actor'
import { outputAllUseCases } from './output/usecase'
import { outputAllState } from './output/state'
import { outputAllView } from './output/view'

export const command = 'list [value]'
export const desc = 'List all items in the model'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { model } = loadValidatedModel(file, value)

  // ------------------------------
  // Actor
  outputAllActors(model)

  // ------------------------------
  // State
  outputAllState(model)

  // ------------------------------
  // Business
  if (model.business) {
    title("業務")
    model.business.instances.forEach(business => {
      info(chalk.green(business.name))
      business.buc.forEach(buc => {
        info(`${buc.name}: ${buc.activity.map(act => act.name).join(' → ')}`)
      })
      br()
    })
  }

  // ------------------------------
  // Usecase
  outputAllUseCases(model)

  // ------------------------------
  // View
  outputAllView(model)
}
