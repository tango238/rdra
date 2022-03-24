import '../array.extensions'
import { ErrorReport } from '../RDRA'
import { JsonSchemaSystem } from '../JsonSchema'

export class System {
  private readonly _name: string
  private readonly _description: string | null
  private readonly _errors: ErrorReport = []

  private constructor(name: string, description: string | null) {
    this._name = name
    this._description = description
  }

  static resolve(source: JsonSchemaSystem): System {
    return new System(source.name, source.description ?? null)
  }

  get name(): string {
    return this._name
  }

  get description(): string | null {
    return this._description
  }

  get errors(): ErrorReport {
    return this._errors
  }
}
