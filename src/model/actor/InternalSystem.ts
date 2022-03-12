import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaInternalSystem } from '../JsonSchema'

export class InternalSystem {
  private readonly _names: string[] = []
  private readonly _instances: InternalSystemInstance[] = []
  private readonly _errors: ErrorReport = []

  private constructor(instances: InternalSystemInstance[]) {
    // invariant(this._names.length == 0, "AlreadyInitialized")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaInternalSystem[]): InternalSystem {
    const system = new InternalSystem(source.map(it => new InternalSystemInstance(it.name, it.description ?? null)))
    const counted = system._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) system._errors.push(`InternalSystem[${key}] is duplicated`)
    })
    return system
  }

  add(instance: InternalSystemInstance) {
    invariant(this._names.find(k => k == instance.name), `NotUnique[${instance.name}]`)
    this._instances.push(instance)
  }

  get(name: string): InternalSystemInstance {
    const result = this._instances.find(i => i.name == name)
    invariant(result, `NotFound[${name}]`)
    return result
  }

  get names(): string[] {
    return this._names
  }

  get instances(): InternalSystemInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class InternalSystemInstance {
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