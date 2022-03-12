import { BaseBuilder, BaseHandler } from './util/types'

export const command = 'state [value]'
export const desc = 'Show list of states and its transitions'


export const builder: BaseBuilder = (yargs) =>
  yargs


export const handler: BaseHandler = async (argv) => {
  console.log(argv)
}