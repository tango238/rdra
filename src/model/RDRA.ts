import { Actor } from './actor/Actor'
import { Overview } from './actor/Overview'
import { ExternalActor } from './actor/ExternalActor'
import { Information } from './information/Information'
import { Usecase } from './usecase/Usecase'
import { State } from './state/State'
import { Variation } from './variation/Variation'
import { Condition } from './condition/Condition'
import { StateTransition } from './state/StateTransition'
import { Business } from './business/Business'
import { JsonSchema } from './JsonSchema'

export type ErrorReport = string[]

export type RelationalModel = {
  overview: Overview
  actor: Actor
  externalActor: ExternalActor | null
  information: Information | null
  state: State | null
  transition: StateTransition | null
  variation: Variation | null
  condition: Condition | null
  business: Business | null
  usecase: Usecase | null
}

export class RDRA {

  private _overview: Overview
  private _actor: Actor

  constructor(overview: Overview, actor: Actor) {
    this._overview = overview
    this._actor = actor
  }

  static from(model: RelationalModel): RDRA {
    return new RDRA(model.overview, model.actor)
  }

  addActor(name: string, description?: string) {
    this._actor = this._actor.add(name, description)
  }

  updateActor(oldName: string, newName: string, description?: string) {
    this._actor = this._actor.update(oldName, newName, description)
  }

  deleteActor(name: string) {
    this._actor = this._actor.delete(name)
  }

  get overview(): Overview {
    return this._overview
  }

  get actor(): Actor {
    return this._actor
  }

  toJSON(): JsonSchema {
    return {
      overview: {
        business: this._overview.business,
        system: this._overview.system,
      },
      actor: this._actor.toJSON(),
      external_system: [],
      information: [],
      usecase: [],
      business: [],
      view: [],
      state: [],
      variation: [],
      condition: [],
    }
  }

  static resolve(source: JsonSchema): RelationalModel {
    const overview = Overview.resolve(source.overview)

    // --------------------------------------
    // アクター

    const srcActor = source.actor.map(actor => typeof actor == "object" ? actor : { name: actor })
    const actor = Actor.resolve(srcActor)

    // external_system が公式RDRAの用語。external_actor は後方互換のための旧称。
    let externalActor = null
    const srcExternal = [...(source.external_system ?? []), ...(source.external_actor ?? [])]
      .map(external => typeof external == "object" ? external : { name: external })
    if (srcExternal.length > 0) {
      externalActor = ExternalActor.resolve(srcExternal)
    }

    // --------------------------------------
    // バリエーション
    const variation = source.variation ? Variation.resolve(source.variation) : null

    // --------------------------------------
    // 情報
    const information = source.information ? Information.resolve(source.information, variation) : null

    // --------------------------------------
    // 状態
    const state = source.state ? State.resolve(source.state) : null

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
    const business = source.business ? Business.resolve(source.business, overview.system, actor, externalActor, usecase) : null

    return {
      overview,
      actor,
      externalActor,
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
