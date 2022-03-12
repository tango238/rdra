import { expect, test } from '@jest/globals'
import { ExternalSystem } from './ExternalSystem'

test('resolve', () => {
  const name = 'external system 1'
  const resolved = ExternalSystem.resolve([{ name }])
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const name = 'external system 1'
  const resolved = ExternalSystem.resolve([{ name }, { name }])
  expect(resolved.errors.length).toBe(1)
})