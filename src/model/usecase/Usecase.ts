import '../array.extensions'
import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaUsecase } from '../JsonSchema'
import { Condition } from '../condition/Condition'
import { Information } from '../information/Information'

export class Usecase {
  private readonly _names: string[] = []
  private readonly _instances: UsecaseInstance[]
  private readonly _errors: ErrorReport = []

  constructor(instances: UsecaseInstance[]) {
    invariant(this._names.length == 0, "ユースケースはすでに初期化済みです。")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(
    source: JsonSchemaUsecase[],
    information: Information | null,
    condition: Condition | null
  ) {
    let errors: ErrorReport = []
    const usecase = new Usecase(source.map(it => {
      const instance = UsecaseInstance.resolve(it, information, condition)
      if (instance.errors.length > 0) errors.push(...instance.errors)
      return instance
    }))
    const counted = usecase._names.countValues()
    counted.forEach((count, key) => {
      if (count > 1) usecase._errors.push(`ユースケース[${key}]が重複しています。`)
    })
    if (errors.length > 0) usecase._errors.push(...errors)
    return usecase
  }

  get names(): string[] {
    return this._names
  }

  get instances(): UsecaseInstance[] {
    return this._instances
  }

  load(name: string): UsecaseInstance {
    const instance = this._instances.find(i => i.name == name)
    invariant(instance)
    return instance
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

class UsecaseInstance {
  private readonly _name: string
  private readonly _view: string[] | null
  private readonly _timer: string[] | null
  private readonly _event: string[] | null
  private readonly _information: string[]
  private readonly _condition: string[] | null
  private readonly _errors: ErrorReport = []

  constructor(name: string, view: string[] | null, timer: string[] | null, event: string[] | null, information: string[], condition: string[] | null) {
    this._name = name
    this._view = view
    this._timer = timer
    this._event = event
    this._information = information
    this._condition = condition
  }

  static resolve(source: JsonSchemaUsecase, information: Information | null, condition: Condition | null) {
    const instance = new UsecaseInstance(
      source.name,
      source.view ?? null,
      source.timer ?? null,
      source.event ?? null,
      source.information,
      source.condition ?? null
    )
    if (!instance._view && !instance._timer && !instance._event) {
      instance._errors.push(`ユースケース[${instance._name}]には画面(view)、タイマー(timer)、イベント(event)のいずれかが必要です。`)
    }
    if (instance._information) {
      if (!information) {
        instance._errors.push(`情報[${instance._information}]が未定義です。`)
      } else {
        const countedInfo = instance._information.countValues()
        countedInfo.forEach((count, key) => {
          if (count > 1) instance._errors.push(`ユースケースに定義されている情報名[${key}]が重複しています。`)
          if (!information.names.includes(key)) instance._errors.push(`ユースケースに定義されている情報名[${key}]が未登録です。`)
        })
      }
    }
    if (instance._condition) {
      const countedCond = instance._condition.countValues()
      countedCond.forEach((count, key) => {
        if (count > 1) instance._errors.push(`ユースケースに定義されている条件名[${key}]が重複しています。`)
        if (condition && !condition.names.includes(key)) instance._errors.push(`ユースケースに定義されている情報名[${key}]が未登録です。`)
      })
    }
    return instance
  }

  get name(): string {
    return this._name
  }

  get view(): string[] | null {
    return this._view
  }

  get timer(): string[] | null {
    return this._timer
  }

  get event(): string[] | null {
    return this._event
  }

  get information(): string[] {
    return this._information
  }

  get condition(): string[] | null {
    return this._condition
  }

  get errors(): ErrorReport {
    return this._errors
  }
}
