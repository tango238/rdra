import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaExternalSystem } from '../JsonSchema'

export class ExternalSystem {
  private readonly _names: string[] = []
  private readonly _instances: ExternalSystemInstance[] = []
  private readonly _errors: ErrorReport = []

  private constructor(instances: ExternalSystemInstance[]) {
    invariant(this._names.length == 0, "外部システムはすでに初期化済みです。")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaExternalSystem[]): ExternalSystem {
    const system = new ExternalSystem(source.map(it => new ExternalSystemInstance(it.name, it.description ?? null)))
    const counted = system._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) system._errors.push(`外部システム名[${key}]が重複しています。`)
    })
    return system
  }

  get(name: string): ExternalSystemInstance {
    const result = this._instances.find(i => i.name == name)
    invariant(result, `外部システム[${name}]が見つかりません。`)
    return result
  }

  get names(): string[] {
    return this._names
  }

  get instances(): ExternalSystemInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class ExternalSystemInstance {
  private readonly _name: string
  private readonly _description: string | null

  constructor(name: string, description: string | null) {
    this._name = name
    this._description = description
  }

  get name(): string {
    return this._name
  }

  get description(): string | null {
    return this._description
  }
}