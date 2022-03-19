import invariant from 'tiny-invariant'
import '../array.extensions'
import { State } from './State'
import { Usecase } from '../usecase/Usecase'
import { ErrorReport } from '../RDRA'
import { JsonSchemaState } from '../JsonSchema'

export class StateTransition {
  private readonly _names: string[] = []
  private readonly _instances: StateGroup[]
  private readonly _errors: ErrorReport = []

  constructor(instances: StateGroup[]) {
    invariant(this._names.length == 0, "状態遷移はすでに初期化済みです。")
    this._instances = instances
  }

  static resolve(
    source: JsonSchemaState[], state: State | null, usecase: Usecase | null
  ) {
    let errors: ErrorReport = []
    const stateTransition = source.map(it => {
      const group = it.group
      const transitionValue = it.value.map(tv => {

        const values = tv.usecase ? tv.usecase.map(uc => {
          const usecaseName = uc.name
          const nextState = uc.next_state
          if (usecase && !usecase.names.includes(usecaseName)) errors.push(`状態[${group}]に指定されているユースケース名[${usecaseName}]が未登録です`)
          if (state && !state.names(group).includes(nextState)) errors.push(`状態[${group}]のユースケース[${usecaseName}]の次の状態[${nextState}]が未登録です`)
          return new StateTransitionUsecase(usecaseName, nextState)
        }): null
        return new StateTransitionValue(tv.name, values)
      })
      return new StateGroup(it.group, transitionValue)
    })
    const transition = new StateTransition(stateTransition)
    if (errors.length > 0) transition._errors.push(...errors)
    return transition
  }

  get names(): string[] {
    return this._names
  }

  get instances(): StateGroup[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

export class StateGroup {
  private readonly _name: string
  private readonly _values: StateTransitionValue[]

  constructor(name: string, values: StateTransitionValue[]) {
    this._name = name
    this._values = values
  }

  get name(): string {
    return this._name
  }

  get values(): StateTransitionValue[] {
    return this._values
  }
}

export class StateTransitionValue {
  private readonly _name: string
  private readonly _usecase: StateTransitionUsecase[] | null

  constructor(name: string, usecase: StateTransitionUsecase[] | null) {
    this._name = name
    this._usecase = usecase
  }

  get name(): string {
    return this._name
  }

  get usecase(): StateTransitionUsecase[] | null{
    return this._usecase
  }
}

export class StateTransitionUsecase {
  private readonly _name: string
  private readonly _nextState: string

  constructor(name: string, nextState: string) {
    this._name = name
    this._nextState = nextState
  }

  get name(): string {
    return this._name
  }

  get nextState(): string {
    return this._nextState
  }
}

