import { expect, test } from '@jest/globals'
import { JsonSchemaUsecase } from '../JsonSchema'
import { Usecase } from './Usecase'
import { Information } from '../information/Information'
import { Condition } from '../condition/Condition'
import { Variation } from '../variation/Variation'
import { State } from '../state/State'


test('resolve', () => {
  const source: JsonSchemaUsecase[] = [{
    name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1']
  }]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error -- name duplicated', () => {
  const source: JsonSchemaUsecase[] = [
    { name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1'] },
    { name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1'] }
  ]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error -- information not found', () => {
  const source: JsonSchemaUsecase[] = [
    { name: 'usecase 1', view: ['view 1'], information: ['info not exist'], condition: ['condition 1'] }
  ]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error -- information duplicated', () => {
  const source: JsonSchemaUsecase[] = [{
    name: 'usecase 1', view: ['view 1'], information: ['info 1', 'info 1'], condition: ['condition 1']
  }]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error -- condition not found', () => {
  const source: JsonSchemaUsecase[] = [{
    name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition not exist']
  }]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error -- condition duplicated', () => {
  const source: JsonSchemaUsecase[] = [{
    name: 'usecase 1', view: ['view 1'], information: ['info 1'], condition: ['condition 1', 'condition 1']
  }]
  const resolved: Usecase = Usecase.resolve(source, information(), condition())
  expect(resolved.errors.length).toBe(1)
})

const information = () => {
  return Information.resolve([
    { name: 'info 1', related: ['info 2'] },
    { name: 'info 2', related: ['info 1'] }
  ], null)
}

const condition = () => {
  return Condition.resolve([{ name: 'condition 1' }], state(), variation())
}

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
    { name: 'variation 1', value: ['value 1'] }
  ])
}