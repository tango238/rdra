import invariant from 'tiny-invariant'
import { ErrorReport } from '../RDRA'
import { JsonSchemaCondition } from '../JsonSchema'
import { State } from './State'
import { Variation } from './Variation'

export class Condition {
  private readonly _names: string[] = []
  private readonly _instances: ConditionInstance[] = []
  private readonly _errors: ErrorReport = []

  constructor(instances: ConditionInstance[]) {
    // invariant(this._names.length == 0, "AlreadyInitialized")
    this._names = instances.map(i => i.name)
    this._instances = instances
  }

  static resolve(
    source: JsonSchemaCondition[],
    state: State | null,
    variation: Variation | null
  ) {
    let errors: ErrorReport = []
    const conditions = source.map(it => {
      if (it.variation && it.state) {
        const instance = new SimpleCondition(it.name, it.description)
        errors.push(`条件には状態とバリエーションを同時に指定できません。`)
        return instance
      }
      if (it.variation) {
        const instance = ConditionOfVariation.resolve(variation, it.name, it.variation, it.description)
        if (instance.errors.length > 0) {
          errors.push(...instance.errors)
        }
        return instance
      }
      if (it.state) {
        const instance = ConditionOfState.resolve(state, it.name, it.state, it.description)
        if (instance.errors.length > 0) {
          errors.push(...instance.errors)
        }
        return instance
      }
      return new SimpleCondition(it.name, it.description)
    })
    const condition = new Condition(conditions)
    const counted = condition._names.countValues()
    counted.forEach((value, key) => {
      if (value > 1) condition._errors.push(`条件名[${key}]が重複しています。`)
    })
    if (errors.length > 0) {
      condition.errors.push(...errors)
    }
    return condition
  }

  get names(): string[] {
    return this._names
  }

  get instances(): ConditionInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }

  load<T extends ConditionInstance>(name: string): T {
    const found = this._instances.find(it => it.name == name)
    invariant(found)
    return found as T
  }
}

export interface ConditionInstance {
  get name(): string
  get type(): string
}

export class SimpleCondition implements ConditionInstance {
  private readonly _name: string
  private readonly _description?: string
  private readonly _errors: ErrorReport = []

  constructor(name: string, description?: string) {
    this._name = name
    this._description = description
  }

  static resolved(name: string, description?: string) {
    return new SimpleCondition(name, description)
  }

  get name(): string {
    return this._name
  }

  get type(): string {
    return "simple"
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class ConditionOfVariation implements ConditionInstance {
  private readonly _name: string
  private readonly _variation: string[]
  private readonly _description?: string
  private readonly _errors: ErrorReport = []

  constructor(name: string, variation: string[], description?: string) {
    this._name = name
    this._variation = variation
    this._description = description
  }

  static resolve(variations: Variation | null, name: string, variation: string[], description?: string) {
    const instance = new ConditionOfVariation(name, variation, description)
    const counted = instance._variation.countValues()
    counted.forEach((count, key) => {
      if (count > 1) instance._errors.push(`条件に定義されているバリエーション[${key}]が重複しています。`)
    })
    for(const value of variation) {
      if (variations && !variations.names.includes(value)) {
        instance._errors.push(`条件に定義されているバリエーション[${value}]がバリエーション一覧から見つかりませんでした。`)
      }
    }
    return instance
  }

  get name(): string {
    return this._name
  }

  get type(): string {
    return "variation"
  }

  get errors(): ErrorReport {
    return this._errors
  }

  get variation(): string[] {
    return this._variation
  }
}

export class ConditionOfState implements ConditionInstance {
  private readonly _name: string
  private readonly _description?: string
  private readonly _state: string
  private readonly _errors: ErrorReport = []

  constructor(name: string, state: string, description?: string) {
    this._name = name
    this._description = description
    this._state = state
  }

  static resolve(states: State | null, name: string, state: string, description?: string) {
    const instance = new ConditionOfState(name, state, description)
    if (states && !states.groups.includes(state)) {
      instance._errors.push(`条件に定義されている状態[${state}]が状態一覧から見つかりませんでした。`)
    }
    return instance
  }

  get name(): string {
    return this._name
  }

  get type(): string {
    return "state"
  }

  get errors(): ErrorReport {
    return this._errors
  }

  get state(): string {
    return this._state
  }
}