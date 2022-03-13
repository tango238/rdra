import chalk from 'chalk'
import invariant from 'tiny-invariant'
import { RelationalModel } from '../../model/RDRA'
import { State } from '../../model/state/State'
import { StateTransition, StateTransitionUsecase } from '../../model/state/StateTransition'
import { br, info, title } from './console'

export const outputAllState = (model: RelationalModel) => {
  if (model.state) {
    if (!hasUsecase(model.transition)) {
      outputState(model.state, model.transition)
    } else {
      invariant(model.transition)
      outputTransition(model.transition)
    }
  }
}

const outputState = (
  state: State,
  transition: (StateTransition | null)
) => {
  if (!hasUsecase(transition)) {
    title("状態")
    state.instances.forEach(it => {
      info(`名前          : ${it.name}`)
      info(`値　          : ${it.values.join(', ')}`)
    })
    br()
  }
}

const outputTransition = (transition: StateTransition) => {
  title("状態遷移")
  transition.instances.forEach(it => {
    info(`名前          : ${chalk.green(it.name)}`)
    it.values.map(value => {
      info(`値　          : ${chalk.blueBright(value.name)}`)
      if (value.usecase) {
        const nextStates = groupByNextState(value.usecase)
        nextStates.forEach(next => {
          info(`- 遷移先状態  : ${next.name}`)
          info(`  遷移UC      : ${next.usecase.join(', ')}`)
        })
      }
      br()
    })
    br()
  })
}


function groupByNextState(usecases: StateTransitionUsecase[] | null) {
  if (!usecases) return []
  const states = Array.from(new Set(usecases.map(uc => uc.nextState))) // unique
  invariant(states)
  return states.flatMap(st => {
    return {
      name: st,
      usecase: usecases.filter(uc => uc.nextState == st).map(uc => uc.name)
    }
  })
}

function hasUsecase(transition: (StateTransition | null)): boolean {
  if (!transition) return false
  const b = transition.instances
    .flatMap(it => it.values
      .flatMap(v => v.usecase))
    .reduce((acc, cur) => {
      if (!acc) return cur != null
      return true
    }, false)
  return b
}