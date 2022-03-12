import { Actor } from './actor/Actor'
import { InternalSystem } from './actor/InternalSystem'
import { ExternalSystem } from './actor/ExternalSystem'
import { Information } from './information/Information'
import { Usecase } from './usecase/Usecase'
import { State } from './state/State'
import { Variation } from './state/Variation'
import { Condition } from './state/Condition'
import { StateTransition } from './state/StateTransition'
import { Business } from './business/Business'
import { JsonSchema } from './JsonSchema'

export type ErrorReport = string[]

export type RelationalModel = {
  actor: Actor
  internalSystem: InternalSystem
  externalSystem: ExternalSystem | null
  information: Information
  state: State | null
  transition: StateTransition | null
  variation: Variation | null
  condition: Condition | null
  business: Business | null
  usecase: Usecase | null
}

export class RDRA {

  resolve(source: JsonSchema): RelationalModel {
    // --------------------------------------
    // アクター
    const srcActor = source.actor.map(actor => typeof actor == "object" ? actor : { name: actor })
    const actor = Actor.resolve(srcActor)

    const srcInternal = source.internal_system.map(internal => typeof internal == "object" ? internal : { name: internal })
    const internalSystem = InternalSystem.resolve(srcInternal)

    let externalSystem = null
    if (source.external_system) {
      const srcExternal = source.external_system.map(external => typeof external == "object" ? external : { name: external })
      externalSystem = ExternalSystem.resolve(srcExternal)
    }

    // --------------------------------------
    // 情報
    const information = Information.resolve(source.information)

    // --------------------------------------
    // 状態
    const state = source.state ? State.resolve(source.state) : null

    // --------------------------------------
    // バリエーション
    const variation = source.variation ? Variation.resolve(source.variation) : null

    // --------------------------------------
    // 条件
    // 条件 -> 状態, バリエーション
    const condition = source.condition ? Condition.resolve(source.condition, state, variation) : null

    // --------------------------------------
    // UC複合
    // UC複合 -> 情報, 条件
    const usecase = source.usecase ? Usecase.resolve(source.usecase, information, condition) : null

    // --------------------------------------
    // 状態遷移
    // 状態 -> UC複合
    const transition = source.state ? StateTransition.resolve(source.state, state, usecase) : null

    // --------------------------------------
    // 業務
    // BUC -> アクター, UC複合
    const business = source.business ? Business.resolve(source.business, actor, internalSystem, externalSystem, usecase) : null

    return {
      actor,
      internalSystem,
      externalSystem,
      information,
      state,
      transition,
      variation,
      condition,
      business,
      usecase
    }
  }
}
