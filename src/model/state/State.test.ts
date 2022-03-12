import { expect, test } from '@jest/globals'
import { State } from './State'
import { JsonSchemaState } from '../JsonSchema'

test('resolve with error', () => {
  const source: JsonSchemaState[] = [
    {
      group: 'group 1', value: [
        {
          name: 'state 1',
          usecase: [{ name: 'usecase 1', next_state: 'next state' }]
        }
      ]
    },
    {
      group: 'group 1', value: [
        {
          name: 'state 2',
          usecase: [{ name: 'usecase 2', next_state: 'next state 2' }]
        }
      ]
    }
  ]
  const resolved = State.resolve(source)
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - state is duplicate', () => {
  const source: JsonSchemaState[] = [
    {
      group: 'group 1', value: [
        {
          name: 'state 1',
          usecase: [{ name: 'usecase 1', next_state: 'next state' }]
        },
        {
          name: 'state 1',
          usecase: [{ name: 'usecase 1', next_state: 'next state' }]
        }
      ]
    }
  ]
  const resolved = State.resolve(source)
  expect(resolved.errors.length).toBe(1)
})

test('names', () => {
  const source: JsonSchemaState[] = [
    {
      group: 'group 1', value: [
        {
          name: 'state 1',
          usecase: [{ name: 'usecase 1', next_state: 'foo' }]
        },
        {
          name: 'state 2',
          usecase: [{ name: 'usecase 2', next_state: 'bar' }]
        }
      ]
    },
    {
      group: 'group 2', value: [
        {
          name: 'state 3',
          usecase:
            [{ name: 'usecase 3', next_state: 'hoge' }]
        }
      ]
    }
  ]
  const resolved = State.resolve(source)
  expect(resolved.names('group 1')).toEqual(['state 1', 'state 2'])
  expect(resolved.names('group 2')).toEqual(['state 3'])
})