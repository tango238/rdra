import type { Arguments, CommandBuilder } from 'yargs'

export type BaseOptions = {
  value: string | undefined
  file: string | undefined
}

export type BaseBuilder = CommandBuilder<BaseOptions, BaseOptions>
export type BaseHandler = (argv: Arguments<BaseOptions>) => PromiseLike<void>

export type UcOptions = BaseOptions & {
  buc: string | undefined
}

export type UcBuilder = CommandBuilder<UcOptions, UcOptions>
export type UcHandler = (argv: Arguments<UcOptions>) => PromiseLike<void>