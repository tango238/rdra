import { expect, test } from '@jest/globals'
import { ExternalActor } from './ExternalActor'

test('resolve', () => {
  const name = 'external system 1'
  const resolved = ExternalActor.resolve([{ name }])
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const name = 'external system 1'
  const resolved = ExternalActor.resolve([{ name }, { name }])
  expect(resolved.errors.length).toBe(1)
})