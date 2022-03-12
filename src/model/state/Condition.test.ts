import { expect, test } from '@jest/globals'
import { Condition } from './Condition'
import { JsonSchemaCondition } from '../JsonSchema'
import { State } from './State'
import { Variation } from './Variation'

test('resolve', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1' },
    { name: 'condition 2', description: 'description' },
    { name: 'condition 3', variation: ['variation 1'] },
    { name: 'condition 4', state: 'state 1' }
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error - name duplicated', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1' },
    { name: 'condition 1', description: 'description' }
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - variation duplicated value', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1', variation: ['variation 1', 'variation 1'] },
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - variation not found', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1', variation: ['variation not exist'] },
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - state not found', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1', state: 'state not exist' }
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - defined variation and state', () => {
  const source: JsonSchemaCondition[] = [
    { name: 'condition 1', variation: ['variation 1'], state: 'state 9' },
  ]
  const resolved = Condition.resolve(source, state(), variation())
  expect(resolved.errors.length).toBe(1)
})

const state = () => {
  return State.resolve([
    {
      group: 'state 1', value: [
        { name: 'value 1', usecase: [{ name: 'usecase 1', next_state: 'value 2' }] },
        { name: 'value 2', usecase: [{ name: 'usecase 2', next_state: 'value 1' }] }
      ]
    }
  ])
}

const variation = () => {
  return Variation.resolve([
    { name: 'variation 1', value: ['value 1']}
  ])
}

