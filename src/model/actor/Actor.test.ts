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