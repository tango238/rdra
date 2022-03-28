import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaInformation, JsonSchemaInformationValue } from '../JsonSchema'
import { Variation } from '../variation/Variation'

export class Information {
  private readonly _names: string[] = []
  private readonly _instances: InformationInstance[] = []
  private readonly _errors: ErrorReport = []

  private constructor(instances: InformationInstance[]) {
    invariant(this._names.length == 0, "情報はすでに初期化済みです。")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(source: JsonSchemaInformation[], variation: Variation | null): Information {
    const instances = source
      .flatMap(it => it.value
        .map(v => new InformationInstance(it.context, v.name, v.description ?? null, v.related, v.variation)))
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
      if (variation && instance.variation) {
        if (!variation.names.includes(instance.variation)) {
          information._errors.push(`情報[${instance.name}]に定義されているバリエーション[${instance.variation}]が未定義です。`)
        }
      }
    })
    return information
  }

  get(name: string): InformationInstance {
    const result = this._instances.find(i => i.name == name)
    invariant(result, `NotFound[${name}]`)
    return result
  }

  get instances(): InformationInstance[] {
    return this._instances
  }

  get names(): string[] {
    return this._names
  }

  contexts(): [string, InformationInstance[]][] {
    return this.instances.groupBy(item => item.context)
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class InformationWithContext {
  private readonly _context: string
  private readonly _value: InformationInstance[]

  constructor(context: string, instances: InformationInstance[]) {
    this._context = context
    this._value = instances
  }

  get context(): string {
    return this._context
  }

  get value(): InformationInstance[] {
    return this._value
  }
}

export class InformationInstance {
  private readonly _context: string
  private readonly _name: string
  private readonly _description: string | null
  private readonly _related: string[]
  private readonly _variation: string

  constructor(context: string, name: string, description: string | null, related: string[] = [], variation: string = '') {
    this._context = context
    this._name = name
    this._description = description
    this._related = related
    this._variation = variation
  }

  get context(): string {
    return this._context
  }

  get name(): string {
    return this._name
  }

  get description(): string | null {
    return this._description
  }

  get related(): string[] {
    return this._related
  }

  get variation(): string {
    return this._variation
  }
}