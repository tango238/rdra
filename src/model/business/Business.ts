import '../array.extensions'
import invariant from 'tiny-invariant'
import { JsonSchemaBusiness } from '../JsonSchema'
import { ErrorReport } from '../RDRA'
import { Actor } from '../actor/Actor'
import { Usecase } from '../usecase/Usecase'
import { ExternalActor } from '../actor/ExternalActor'

export class Business {
  private readonly _names: string[] = []
  private readonly _instances: BusinessInstance[]
  private readonly _errors: ErrorReport = []

  constructor(instances: BusinessInstance[]) {
    invariant(this._names.length == 0, "業務はすでに初期化済みです。")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(
    source: JsonSchemaBusiness[],
    system: string,
    actor: Actor,
    externalActor: ExternalActor | null,
    usecase: Usecase | null
  ) {
    const errors: ErrorReport = []
    const instances = source.map(it => {
      const mainCounted = it.main_actor.countValues()
      mainCounted.forEach((count: number, main: string) => {
        if (count > 1) errors.push(`業務[${it.name}]に指定されている登場人物[${main}]が重複しています。`)
        if (system != main && !actor.names.includes(main) && !externalActor?.names.includes(main)) {
          errors.push(`業務[${it.name}]に指定されているアクター[${main}]が未登録です。`)
        }
      })
      const buc = it.buc.map(b => {
        const activity = b.activity.map(a => {
          if (a.used_by) {
            const usedByCounted = a.used_by.countValues()
            usedByCounted.forEach((count: number, usedBy: string) => {
              if (count > 1) errors.push(`アクティビティ[${a.name}]に指定されているアクター[${usedBy}]が重複しています。`)
              if (system != usedBy && !actor.names.includes(usedBy) && !externalActor?.names.includes(usedBy)) {
                errors.push(`アクティビティ[${a.name}]に指定されているアクター[${usedBy}]が未登録です。`)
              }
            })
          }
          if (a.usecase) {
            const usecaseCounted = a.usecase.countValues()
            usecaseCounted.forEach((count, uc) => {
              if (count > 1) errors.push(`アクティビティ[${a.name}]に指定されているユースケース[${uc}]が重複しています。`)
              if (usecase && !usecase.names.includes(uc)) errors.push(`アクティビティ[${a.name}]に指定されているユースケース[${uc}]が未登録です。`)
            })
          }
          return new Activity(a.name, a.used_by, a.usecase)
        })
        const activityNames = activity.map(a => a.name)
        const counted = activityNames.countValues()
        counted.forEach((count, key) => {
          if (count > 1) errors.push(`アクティビティ[${key}]が重複しています。`)
        })
        return new Buc(b.name, activity)
      })
      const bucNames = buc.map(b => b.name)
      const counted = bucNames.countValues()
      counted.forEach((count, key) => {
        if (count > 1) errors.push(`BUC[${key}]が重複しています`)
      })

      return new BusinessInstance(it.name, it.main_actor, buc)
    })
    const business = new Business(instances)

    const counted = business._names.countValues()
    counted.forEach((count, key) => {
      if (count > 1) business._errors.push(`業務[${key}]が重複しています。`)
    })
    if (errors.length > 0) business._errors.push(...errors)
    return business
  }

  get names(): string[] {
    return this._names
  }

  get instances(): BusinessInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class BusinessInstance {
  private readonly _name: string
  private readonly _main: string[]
  private readonly _buc: Buc[]

  constructor(name: string, main: string[], buc: Buc[]) {
    this._name = name
    this._main = main
    this._buc = buc
  }

  get name(): string {
    return this._name
  }

  get main(): string[] {
    return this._main
  }

  get buc(): Buc[] {
    return this._buc
  }
}

export class Buc {
  private readonly _name: string
  private readonly _activity: Activity[]

  constructor(name: string, activity: Activity[]) {
    this._name = name
    this._activity = activity
  }

  get name(): string {
    return this._name
  }

  get activity(): Activity[] {
    return this._activity
  }
}

export class Activity {
  private readonly _name: string
  private readonly _used_by: string[]
  private readonly _usecase: string[] | null

  constructor(name: string, used_by: string[], usecase: string[] | null) {
    this._name = name
    this._used_by = used_by
    this._usecase = usecase
  }

  get name(): string {
    return this._name
  }

  get used_by(): string[] {
    return this._used_by
  }

  get usecase(): string[] | null {
    return this._usecase
  }
}