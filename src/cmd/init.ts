import { BaseBuilder, BaseHandler } from './util/types'
import * as fs from 'fs'
import { initialize } from './commands/initialize'

export const command = 'init'
export const desc = 'Create YAML to start creating RDRA model'


export const builder: BaseBuilder = (yargs) =>
  yargs

export const handler: BaseHandler = async (argv) => {
  let path = './rdra.yml'
  if (fs.existsSync(path)) {
    path = path + '.' + new Date().toISOString().split('.')[0]
  }

  initialize(path)
}
