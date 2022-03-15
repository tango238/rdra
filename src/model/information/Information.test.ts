import { expect, test } from '@jest/globals'
import { Information } from './Information'
import { JsonSchemaInformation } from '../JsonSchema'

test('resolve with no error', () => {
  const source: JsonSchemaInformation[] = [
    { name: 'info 1', related: ['info 2', 'info 3'] },
    { name: 'info 2' },
    { name: 'info 3', related: ['info 4'] },
    { name: 'info 4', description: 'desc 4', related: ['info 3'] }
  ]
  const resolved = Information.resolve(source, null)
  expect(resolved.errors.length).toBe(0)
})

test('resolve with error - name duplicates', () => {
  const name = 'info 1'
  const source: JsonSchemaInformation[] = [{ name }, { name }]
  const resolved = Information.resolve(source, null)
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - related is the same as its own name', () => {
  const source: JsonSchemaInformation[] = [
    { name: 'info 1', related: ['info 1'] },
    { name: 'info 2' }
  ]
  const resolved = Information.resolve(source, null)
  expect(resolved.errors.length).toBe(1)
})

test('resolve with error - related to no registration name', () => {
  const source: JsonSchemaInformation[] = [
    { name: 'info 1', related: ['info 2', 'info 4'] },
    { name: 'info 2' }
  ]
  const resolved = Information.resolve(source, null)
  expect(resolved.errors.length).toBe(1)
})