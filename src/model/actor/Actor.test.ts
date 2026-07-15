import { expect, test } from '@jest/globals'
import { Actor } from './Actor'

test('resolve', () => {
  const name = 'actor1'
  const resolved = Actor.resolve([{ name }])
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const name = 'actor1'
  const resolved = Actor.resolve([{ name }, { name }])
  expect(resolved.errors.length).toBe(1)
})

test('create', () => {
  const actor = Actor.create([{ name: 'actor1', description: 'desc1' }, { name: 'actor2' }])
  expect(actor.names).toEqual(['actor1', 'actor2'])
  expect(actor.get('actor1').description).toBe('desc1')
  expect(actor.errors.length).toBe(0)
})

test('add', () => {
  const original = Actor.create([{ name: 'actor1' }])
  const updated = original.add('actor2', 'desc2')

  expect(updated.names).toEqual(['actor1', 'actor2'])
  expect(updated.get('actor2').description).toBe('desc2')
  expect(updated.errors.length).toBe(0)
})

test('add does not mutate the original instance', () => {
  const original = Actor.create([{ name: 'actor1' }])
  original.add('actor2')

  expect(original.names).toEqual(['actor1'])
  expect(original.instances.length).toBe(1)
})

test('add with a duplicate name returns an actor carrying the error', () => {
  const original = Actor.create([{ name: 'actor1' }])
  const updated = original.add('actor1')

  expect(updated.errors.length).toBe(1)
  expect(updated.names).toEqual(['actor1'])
})

test('update', () => {
  const original = Actor.create([{ name: 'actor1', description: 'desc1' }])
  const updated = original.update('actor1', 'actor1-renamed', 'new desc')

  expect(updated.names).toEqual(['actor1-renamed'])
  expect(updated.get('actor1-renamed').description).toBe('new desc')
  expect(original.names).toEqual(['actor1'])
})

test('delete', () => {
  const original = Actor.create([{ name: 'actor1' }, { name: 'actor2' }])
  const updated = original.delete('actor1')

  expect(updated.names).toEqual(['actor2'])
  expect(original.names).toEqual(['actor1', 'actor2'])
})