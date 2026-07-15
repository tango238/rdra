import { BaseBuilder, BaseHandler } from './util/types'
import { createSourceBuilder, loadValidatedModel } from './util/model'
import { info, title } from './output/console'
import { table } from 'table-b'
import chalk from 'chalk'

export const command = 'info [value]'
export const desc = 'Show a list of information'


export const builder: BaseBuilder = (yargs) => createSourceBuilder(yargs)


export const handler: BaseHandler = async (argv) => {
  const { file, value } = argv
  const { model } = loadValidatedModel(file, value)

  if (!model.information) {
    info("情報が未定義です。")
    process.exit(0)
  }

  // ------------------------------
  // Information
  title("情報")

  let rows: string[][] = []

  model.information.instances.map(info => {
    rows.push([info.name, info.description ?? '-', info.related.join(', '), info.variation])
  })

  rows.unshift([
    chalk.green('[情報名]'),
    chalk.green('[説明]'),
    chalk.green('[関連]'),
    chalk.green('[バリエーション]')
  ])
  info(table(rows))
}
