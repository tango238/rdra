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
  .epilogue('For more information, check https://github.com/tango238/rdra')
  .fail(handleError).argv
