import { BaseBuilder, BaseHandler } from './util/types'

export const command = 'graph [value]'
export const desc = 'Generate relational graphs'


export const builder: BaseBuilder = (yargs) =>
  yargs


export const handler: BaseHandler = async (argv) => {
  console.log(argv)
}