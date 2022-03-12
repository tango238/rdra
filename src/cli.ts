#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import handleError from './handleError'

yargs(hideBin(process.argv))
  .commandDir('./cmd', { extensions: ['ts', 'js'] })
  .command(
    '$0',
    'Usage',
    () => undefined,
    () => {
      yargs.showHelp()
    },
  )
  .strict()
  .alias({ h: 'help' })
  .epilogue('For more information, check https://xxx')
  .fail(handleError).argv


// RDRA
// const cli = new CommandLineFacade()
// const errors = cli.run(filePath)
// console.log(errors)
