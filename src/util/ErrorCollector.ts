import { RDRA, RelationalModel } from '../model/RDRA'
import { Actor } from '../model/actor/Actor'
import { ExternalActor } from '../model/actor/ExternalActor'
import { State } from '../model/state/State'
import { Information } from '../model/information/Information'
import { StateTransition } from '../model/state/StateTransition'
import { Variation } from '../model/variation/Variation'
import { Condition } from '../model/condition/Condition'
import { Business } from '../model/business/Business'
import { Usecase } from '../model/usecase/Usecase'
import { JsonSchema } from '../model/JsonSchema'
import { error } from '../cmd/output/console'

export class ErrorCollector {

  static printJsonErrors(json: JsonSchema): boolean {
    const model = RDRA.resolve(json)
    const errors = ErrorCollector.collect(model)
    if (errors.length > 0) {
      errors.forEach(err => {
        error(err + '\n')
      })
      return true
    }
    // no errors
    return false
  }

  static collect(model: RelationalModel): string[] {
    const sources: (Actor | ExternalActor | Information | State | StateTransition | Variation | Condition | Business | Usecase | null)[] = [
      model.actor,
      model.externalActor,
      model.information,
      model.state,
      model.transition,
      model.variation,
      model.condition,
      model.business,
      model.usecase,
    ]

    return sources
      .filter((source): source is Exclude<typeof source, null> => source != null)
      .flatMap(source => source.errors)
  }

}
