import '../array.extensions'
import invariant from 'tiny-invariant'
import { JsonSchemaVariation } from '../JsonSchema'
import { ErrorReport } from '../RDRA'

export class Variation {
  private readonly _names: string[] = []
  private readonly _instances: VariationInstance[]
  private readonly _errors: ErrorReport = []

  constructor(instances: VariationInstance[]) {
    // invariant(this._names.length == 0, "AlreadyInitialized")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaVariation[]) {
    let errors: ErrorReport = []
    const variation =  new Variation(source.map(v => {
      const instance = VariationInstance.resolved(v.name, v.value)
      if (instance.errors.length > 0) {
        errors.push(...instance.errors)
      }
      return instance
    }))

    const counted = variation._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) variation._errors.push(`バリエーション[${key}]が重複しています。`)
    })
    if (errors.length > 0) {
      variation._errors.push(...errors)
    }
    return variation
  }

  get names(): string[] {
    return this._names
  }

  get instances(): VariationInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

class VariationInstance {
  private readonly _name: string
  private readonly _value: string[] = []
  private readonly _errors: ErrorReport = []

  constructor(name: string, value: string[]) {
    this._name = name
    this._value = value
  }

  static resolved(name: string, values: string[]) {
    const instance = new VariationInstance(name, values)
    const counted = values.countValues()
    counted.forEach((value, key) => {
      if (value > 1) instance._errors.push(`Value in Variation[${key}] is duplicated`)
    })
    return instance
  }

  get name(): string {
    return this._name
  }

  get value(): string[] {
    return this._value
  }

  get errors(): ErrorReport {
    return this._errors
  }
}