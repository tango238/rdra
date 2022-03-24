import { expect, test } from '@jest/globals'
import { System } from './InternalSystem'

test('resolve', () => {
  const name = 'internal system 1'
  const resolved = System.resolve([{ name }])
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const name = 'internal system 1'
  const resolved = System.resolve([{ name }, { name }])
  expect(resolved.errors.length).toBe(1)
})
