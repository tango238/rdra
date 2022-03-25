import '../array.extensions'
import { ErrorReport } from '../RDRA'
import { JsonSchemaOverview } from '../JsonSchema'

export class Overview {
  private readonly _business: string
  private readonly _system: string
  private readonly _errors: ErrorReport = []

  private constructor(business: string, system: string) {
    this._business = business
    this._system = system
  }

  static resolve(source: JsonSchemaOverview): Overview {
    return new Overview(source.business, source.system)
  }

  get business(): string {
    return this._business
  }

  get system(): string {
    return this._system
  }

  get errors(): ErrorReport {
    return this._errors
  }
}
