import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaActor } from '../JsonSchema'

export class Actor {
  private readonly _names: string[] = []
  private readonly _instances: ActorInstance[] = []
  private readonly _errors: ErrorReport = []

  private constructor(instances: ActorInstance[]) {
    // invariant(this._names.length == 0, "AlreadyInitialized")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaActor[]): Actor {
    const actor = new Actor(source.map(it => new ActorInstance(it.name, it.description ?? null)))
    const counted = actor._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) actor._errors.push(`Actor[${key}] is duplicated`)
    })
    return actor
  }

  add(instance: ActorInstance) {
    invariant(this._names.find(k => k == instance.name), `NotUnique[${instance.name}]`)
    this._instances.push(instance)
  }

  get(name: string): ActorInstance {
    const result = this._instances.find(i => i.name == name)
    invariant(result, `NotFound[${name}]`)
    return result
  }

  get names(): string[] {
    return this._names
  }

  get instances(): ActorInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class ActorInstance {
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