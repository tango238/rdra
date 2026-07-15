import { expect, test } from '@jest/globals'
import { ErrorCollector } from './ErrorCollector'
import { RDRA } from '../model/RDRA'
import { JsonSchema } from '../model/JsonSchema'

const overview = { business: 'overview business', system: 'overview system' }

test('collect - no errors when nothing is invalid', () => {
  const source: JsonSchema = {
    overview,
    actor: [{ name: 'actor1' }],
    external_actor: null,
    information: [],
    usecase: null,
    business: null,
    view: null,
    state: null,
    variation: null,
    condition: null,
  }

  const errors = ErrorCollector.collect(RDRA.resolve(source))
  expect(errors).toEqual([])
})

test('collect - gathers errors from multiple sources in a fixed order', () => {
  // actor1 is duplicated (actor error) and business1 is duplicated (business error).
  const source: JsonSchema = {
    overview,
    actor: [{ name: 'actor1' }, { name: 'actor1' }],
    external_actor: null,
    information: [],
    usecase: null,
    business: [
      { name: 'business1', main_actor: ['actor1'], buc: [] },
      { name: 'business1', main_actor: ['actor1'], buc: [] },
    ],
    view: null,
    state: null,
    variation: null,
    condition: null,
  }

  const errors = ErrorCollector.collect(RDRA.resolve(source))

  expect(errors.length).toBe(2)
  expect(errors[0]).toContain('アクター[actor1]が重複しています。')
  expect(errors[1]).toContain('業務[business1]が重複しています。')
})

test('printJsonErrors - returns false and prints nothing when the model is valid', () => {
  const source: JsonSchema = {
    overview,
    actor: [{ name: 'actor1' }],
    external_actor: null,
    information: [],
    usecase: null,
    business: null,
    view: null,
    state: null,
    variation: null,
    condition: null,
  }

  expect(ErrorCollector.printJsonErrors(source)).toBe(false)
})

test('printJsonErrors - returns true when the model has errors', () => {
  const source: JsonSchema = {
    overview,
    actor: [{ name: 'actor1' }, { name: 'actor1' }],
    external_actor: null,
    information: [],
    usecase: null,
    business: null,
    view: null,
    state: null,
    variation: null,
    condition: null,
  }

  expect(ErrorCollector.printJsonErrors(source)).toBe(true)
})
