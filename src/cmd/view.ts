import { BaseBuilder, BaseHandler } from './util/types'

export const command = 'view [value]'
export const desc = 'Show list of views'


export const builder: BaseBuilder = (yargs) =>
  yargs
    .options({
      file: { type: 'string', alias: 'f', conflicts: 'value' },
      information: { type: 'string', alias: 'info' }
    })
    .positional('value', { type: 'string' })



export const handler: BaseHandler = async (argv) => {
  console.log(argv)
}