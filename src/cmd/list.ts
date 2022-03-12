import chalk from 'chalk'
import { BaseBuilder, BaseHandler } from './util/types'
import { Yaml } from '../util/Yaml'
import { RDRA } from '../model/RDRA'
import { ErrorCollector } from '../util/ErrorCollector'
import { title, info, br, error } from './output/console'
import { checkFileExists, getSourcePath } from './util/options'
import { outputAllActors } from './output/actor'
import { outputAllUseCases } from './output/usecase'

export const command = 'list [value]'
export const desc = 'List all items in the model'


export const builder: BaseBuilder = (yargs) =>
  yargs
    .options({
      file: { type: 'string', alias: 'f', conflicts: 'value' }
    })
    .positional('value', { type: 'string' })
    .check((argv, _options) => {
      const { file, value } = argv
      checkFileExists(file, value)
      return argv
    })


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const sourcePath = getSourcePath(file, value)
  let errors = []

  // Parse YAML
  const yaml = new Yaml()
  const input = yaml.load(sourcePath)
  errors = yaml.validate(input)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // RDRA Model
  const rdra = new RDRA()
  const model = rdra.resolve(input)
  errors = ErrorCollector.collect(model)
  if (errors.length > 0) {
    errors.forEach(err => {
      error(err)
    })
    process.exit(1)
  }

  // ------------------------------
  // Actor
  outputAllActors(model)

  // ------------------------------
  // State
  if (model.state) {
    title("状態")
    model.state.instances.forEach(it => {
      info(`${it.name}: [${it.values.join(', ')}]`)
    })
    br()

    if (model.transition) {
      title("状態遷移")
      model.transition.instances.forEach(it => {
        info(chalk.green(it.name))
        it.values.map(value => {
          info(`${value.name}`)
          value.usecase ? value.usecase.forEach(uc => {
            info(`  → ${uc.nextState}: ${uc.name}`)
          }) : null
        })
        br()
      })
    }
  }

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
  if (model.usecase) {
    outputAllUseCases(model)
  }

  // ------------------------------
  // View
  if (model.usecase) {
    title("画面")
    model.usecase.instances.forEach(uc => {
      uc.view ? uc.view.forEach(v => {
        info(v)
        info(`  → ${uc.information.join(', ')}`)
      }) : null
    })
  }
}
