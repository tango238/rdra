import { expect, test } from '@jest/globals'
import { JsonSchemaState } from '../JsonSchema'
import { State } from './State'
import { StateTransition } from './StateTransition'
import { Usecase } from '../usecase/Usecase'
import { Information } from '../information/Information'
import { Condition } from '../condition/Condition'
import { Variation } from '../variation/Variation'


test('resolve with error - state is duplicate', () => {
  const source: JsonSchemaState[] = [
    {
      group: 'group 1', value: [
        {
          name: 'state 1',
          usecase: [{ name: 'usecase 1', next_state: 'next state' }]
        },
        {
          name: 'state 2',
          usecase: [{ name: 'usecase 1', next_state: 'state 1' }]
        }
      ]
    }
  ]

  const state = State.resolve(source)
  const usecase = () => {
    const source = [{ name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1'] }]
    return Usecase.resolve(source, information(), condition())
  }
  const condition = () => Condition.resolve([{ name: 'condition 1' }], state, variation())
  const resolved = StateTransition.resolve(source, state, usecase())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - usecase not found', () => {
  const source: JsonSchemaState[] = [
    {
      group: 'group 1', value: [
        {
          name: 'state 1',
          usecase:
            [{ name: 'usecase 1', next_state: 'state 2' }]
        },
        {
          name: 'state 2',
          usecase:
            [{ name: 'usecase not exist', next_state: 'state 1' }]
        }
      ]
    }
  ]

  const state = State.resolve(source)
  const usecase = () => {
    const source = [{ name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1'] }]
    return Usecase.resolve(source, information(), condition())
  }
  const condition = () => Condition.resolve([{ name: 'condition 1' }], state, variation())
  const resolved = StateTransition.resolve(source, state, usecase())
  expect(resolved.errors.length).toBe(1)
})

const information = () => {
  return Information.resolve([
    { name: 'info 1', related: ['info 2'] },
    { name: 'info 2', related: ['info 1'] }
  ], null)
}

const variation = () => {
  return Variation.resolve([
    { name: 'variation 1', value: ['value 1'] }
  ])
}