import { BaseBuilder, BaseHandler } from './util/types'

export const command = 'buc [value]'
export const desc = ''


export const builder: BaseBuilder = (yargs) =>
  yargs


export const handler: BaseHandler = async (argv) => {
  console.log(argv)
}