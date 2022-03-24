import invariant from 'tiny-invariant'
import { RelationalModel } from '../model/RDRA'
import { Actor } from '../model/actor/Actor'
import { ExternalSystem } from '../model/actor/ExternalSystem'
import { State } from '../model/state/State'
import { Information } from '../model/information/Information'
import { StateTransition } from '../model/state/StateTransition'
import { Variation } from '../model/variation/Variation'
import { Condition } from '../model/condition/Condition'
import { Business } from '../model/business/Business'
import { Usecase } from '../model/usecase/Usecase'

export class ErrorCollector {

  static collect(model: RelationalModel): string[] {
    let errors: string[] = []
    if (this.hasError(model.actor)) {
      errors.push(...model.actor.errors)
    }
    if (this.notNullAndHasError(model.externalSystem)) {
      invariant(model.externalSystem)
      errors.push(...model.externalSystem.errors)
    }
    if (this.notNullAndHasError(model.information)) {
      invariant(model.information)
      errors.push(...model.information.errors)
    }
    if (this.notNullAndHasError(model.state)) {
      invariant(model.state)
      errors.push(...model.state.errors)
    }
    if (this.notNullAndHasError(model.transition)) {
      invariant(model.transition)
      errors.push(...model.transition.errors)
    }
    if (this.notNullAndHasError(model.variation)) {
      invariant(model.variation)
      errors.push(...model.variation.errors)
    }
    if (this.notNullAndHasError(model.condition)) {
      invariant(model.condition)
      errors.push(...model.condition.errors)
    }
    if (this.notNullAndHasError(model.business)) {
      invariant(model.business)
      errors.push(...model.business.errors)
    }
    if (this.notNullAndHasError(model.usecase)) {
      invariant(model.usecase)
      errors.push(...model.usecase.errors)
    }

    return errors
  }

  private static notNullAndHasError(source: ExternalSystem | Information| Business | Variation | Condition | Usecase | State | StateTransition | null): boolean {
    if (source == null) return false
    return source.errors.length > 0
  }

  private static hasError(source: Actor): boolean {
    return source.errors.length > 0
  }

}