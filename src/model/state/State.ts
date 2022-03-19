import '../array.extensions'
import invariant from 'tiny-invariant'
import { JsonSchemaState } from '../JsonSchema'
import { ErrorReport } from '../RDRA'

type StateNamesByGroup  = { [name: string]: string[] }

export class State {
  private readonly _groups: string[] = []
  private readonly _names: StateNamesByGroup = {}
  private readonly _instances: StateGroupInstance[] = []
  private readonly _errors: ErrorReport = []

  constructor(instances: StateGroupInstance[], stateNamesByGroup: StateNamesByGroup) {
    invariant(this._groups.length == 0, "状態はすでに初期化済みです。")
    this._groups = instances.map(i => i.name)
    this._names = stateNamesByGroup
    this._instances = instances
  }

  static resolve(source: JsonSchemaState[]) {
    const errors:ErrorReport = []
    const names:StateNamesByGroup = {}
    const instances = source.map(it => {
      const values = it.value.map(v => v.name)
      const groupInstance = new StateGroupInstance(it.group, values)
      names[it.group] = values
      const counted = values.countValues()
      counted.forEach((count, key) => {
        if (count > 1) errors.push(`状態[${it.group}]に同じ値[${key}]が複数回指定されています。`)
      })
      return groupInstance
    })
    const state = new State(instances, names)
    const counted = state._groups.countValues()
    counted.forEach((value, key) => {
      if (value > 1) state._errors.push(`状態[${key}]が重複しています。`)
    })
    if (errors.length > 0) state._errors.push(...errors)
    return state
  }

  get groups(): string[] {
    return this._groups
  }

  names(group: string):string[] {
    return this._names[group]
  }

  get instances(): StateGroupInstance[] {
    return this._instances
  }

  get errors(): ErrorReport {
    return this._errors
  }
}

class StateGroupInstance {
  private readonly _name: string
  private readonly _values: string[]

  constructor(name: string, values: string[]) {
    this._name = name
    this._values = values
  }

  get name(): string {
    return this._name
  }

  get values(): string[] {
    return this._values
  }
}