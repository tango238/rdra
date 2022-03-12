import { expect, test } from '@jest/globals'
import { InternalSystem } from './InternalSystem'

test('resolve', () => {
  const name = 'internal system 1'
  const resolved = InternalSystem.resolve([{ name }])
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const name = 'internal system 1'
  const resolved = InternalSystem.resolve([{ name }, { name }])
  expect(resolved.errors.length).toBe(1)
})
