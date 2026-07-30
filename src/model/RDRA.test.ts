import { expect, test } from '@jest/globals'
import { RDRA } from './RDRA'
import { JsonSchema } from './JsonSchema'

const overview = { business: 'overview business', system: 'overview system' }

const minimalSource = (): JsonSchema => ({
  overview,
  actor: [{ name: 'actor1' }],
  external_actor: null,
  external_system: null,
  information: [],
  usecase: null,
  business: null,
  view: null,
  state: null,
  variation: null,
  condition: null,
})

const fullSource = (): JsonSchema => ({
  overview,
  actor: [{ name: 'actor1' }],
  external_actor: null,
  external_system: [{ name: 'external1' }],
  information: [{ context: 'ctx1', value: [{ name: 'info1' }] }],
  usecase: [{ name: 'usecase1', view: ['view1'], information: ['info1'], condition: ['condition1'] }],
  business: [{ name: 'business1', main_actor: ['actor1'], buc: [] }],
  view: ['view1'],
  state: [{ group: 'group1', value: [{ name: 'state1', usecase: null }] }],
  variation: [{ name: 'variation1', value: ['v1'] }],
  condition: [{ name: 'condition1' }],
})

test('resolve - optional members are null when the source omits them', () => {
  const model = RDRA.resolve(minimalSource())

  expect(model.actor.names).toEqual(['actor1'])
  expect(model.externalActor).toBeNull()
  expect(model.information).not.toBeNull() // an empty array still resolves to an (empty) Information
  expect(model.state).toBeNull()
  expect(model.transition).toBeNull()
  expect(model.variation).toBeNull()
  expect(model.condition).toBeNull()
  expect(model.business).toBeNull()
  expect(model.usecase).toBeNull()
})

test('resolve - optional members are resolved when the source provides them', () => {
  const model = RDRA.resolve(fullSource())

  expect(model.externalActor).not.toBeNull()
  expect(model.information).not.toBeNull()
  expect(model.state).not.toBeNull()
  expect(model.transition).not.toBeNull()
  expect(model.variation).not.toBeNull()
  expect(model.condition).not.toBeNull()
  expect(model.business).not.toBeNull()
  expect(model.usecase).not.toBeNull()
  expect(model.usecase?.errors.length).toBe(0)
  expect(model.business?.errors.length).toBe(0)
})

test('toJSON', () => {
  const model = RDRA.resolve({
    ...minimalSource(),
    actor: [{ name: 'actor1', description: 'desc1' }, { name: 'actor2' }],
  })
  const rdra = RDRA.from(model)

  expect(rdra.toJSON()).toEqual({
    overview,
    actor: [{ name: 'actor1', description: 'desc1' }, 'actor2'],
    external_system: [],
    information: [],
    usecase: [],
    business: [],
    view: [],
    state: [],
    variation: [],
    condition: [],
  })
})

test('resolve - external_actor (deprecated) and external_system are merged', () => {
  const model = RDRA.resolve({
    ...minimalSource(),
    external_actor: ['legacy1'],
    external_system: [{ name: 'external1' }],
  })

  expect(model.externalActor?.names).toEqual(['external1', 'legacy1'])
  expect(model.externalActor?.errors.length).toBe(0)
})

test('resolve - usecase triggered by timer resolves without error', () => {
  const model = RDRA.resolve({
    ...fullSource(),
    usecase: [{ name: 'usecase1', timer: ['timer1'], information: ['info1'] }],
  })

  expect(model.usecase?.errors.length).toBe(0)
  expect(model.usecase?.load('usecase1').timer).toEqual(['timer1'])
})

test('resolve - usecase triggered by event resolves without error', () => {
  const model = RDRA.resolve({
    ...fullSource(),
    usecase: [{ name: 'usecase1', event: ['event1'], information: ['info1'] }],
  })

  expect(model.usecase?.errors.length).toBe(0)
  expect(model.usecase?.load('usecase1').event).toEqual(['event1'])
})

test('resolve - usecase without view/timer/event produces an error', () => {
  const model = RDRA.resolve({
    ...fullSource(),
    usecase: [{ name: 'usecase1', information: ['info1'] }],
  })

  expect(model.usecase?.errors.length).toBe(1)
})

test('addActor', () => {
  const rdra = RDRA.from(RDRA.resolve(minimalSource()))
  rdra.addActor('actor2', 'desc2')

  expect(rdra.actor.names).toEqual(['actor1', 'actor2'])
  expect(rdra.actor.errors.length).toBe(0)
})

test('addActor - duplicate name produces an error', () => {
  const rdra = RDRA.from(RDRA.resolve(minimalSource()))
  rdra.addActor('actor1')

  expect(rdra.actor.names).toEqual(['actor1'])
  expect(rdra.actor.errors.length).toBe(1)
})

test('updateActor', () => {
  const rdra = RDRA.from(RDRA.resolve(minimalSource()))
  rdra.updateActor('actor1', 'actor1-renamed', 'new desc')

  expect(rdra.actor.names).toEqual(['actor1-renamed'])
  expect(rdra.actor.get('actor1-renamed').description).toBe('new desc')
})

test('deleteActor', () => {
  const rdra = RDRA.from(RDRA.resolve(minimalSource()))
  rdra.deleteActor('actor1')

  expect(rdra.actor.names).toEqual([])
})
