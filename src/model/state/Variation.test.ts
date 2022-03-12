import { expect, test } from '@jest/globals'
import { Variation } from './Variation'

test('resolve', () => {
  const source = [
    {
      name: 'variation 1',
      value: [
        'value1', 'value2', 'value3'
      ]
    },
    {
      name: 'variation 2',
      value: [
        'value1', 'value2', 'value3'
      ]
    }
  ]
  const resolved = Variation.resolve(source)
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error', () => {
  const source = [
    {
      name: 'variation 1',
      value: [
        'value1', 'value2', 'value3'
      ]
    },
    {
      name: 'variation 1',
      value: [
        'value1', 'value2', 'value3'
      ]
    }
  ]
  const resolved = Variation.resolve(source)
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - value duplicated', () => {
  const source = [
    {
      name: 'variation 1',
      value: [
        'value1', 'value2', 'value3'
      ]
    },
    {
      name: 'variation 2',
      value: [
        'value1', 'value1', 'value3'
      ]
    }
  ]
  const resolved = Variation.resolve(source)
  expect(resolved.errors.length).toBe(1)
})