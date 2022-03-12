import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaInformation } from '../JsonSchema'

export class Information {
  private readonly _names: string[] = []
  private readonly _instances: InformationInstance[] = []
  private readonly _errors: ErrorReport = []

  private constructor(instances: InformationInstance[]) {
    // invariant(this._names.length == 0, `AlreadyInitialized`)
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaInformation[]): Information {
    const instances = source.map(it => {
      const description = it.description ?? ''
      const related = it.related ?? []
      return new InformationInstance(it.name, description, related)
    })
    const information = new Information(instances)
    const counted = information._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) information._errors.push(`情報[${key}]が重複しています。`)
    })
    instances.map(instance => {
      if (instance.related.includes(instance.name)) {
        information._errors.push(`情報[${instance.name}]は同じ情報内の関連には指定できません。`)
      }
      instance.related.map(it => {
        if (!information._names.includes(it)) {
          information._errors.push(`情報[${instance.name}]に定義されている関連[${it}]が未定義です。`)
        }
      })
    })
    return information
  }

  add(instance: InformationInstance) {
    invariant(this._names.includes(instance.name), `NotUnique[${instance.name}]`)
    this._instances.push(instance)
  }

  get(name: string): InformationInstance {
    const result = this._instances.find(i => i.name == name)
    invariant(result, `NotFound[${name}]`)
    return result
  }

  get names(): string[] {
    return this._names
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class InformationInstance {
  private readonly _name: string
  private readonly _description: string
  private readonly _related: string[]

  constructor(name: string, description: string, related: string[]) {
    this._name = name
    this._description = description
    this._related = related
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get related(): string[] {
    return this._related
  }
}