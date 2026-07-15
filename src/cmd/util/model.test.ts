import { expect, jest, test } from '@jest/globals'
import * as path from 'path'
import { loadValidatedModel } from './model'

const fixture = (name: string) => path.join(__dirname, 'fixtures', name)
const validSource = path.join(__dirname, '../../../example/simple/rdra.yml')

test('loadValidatedModel - returns the source path and resolved model for a valid file', () => {
  const { sourcePath, model } = loadValidatedModel(undefined, validSource)

  expect(sourcePath).toBe(validSource)
  expect(model.actor.names).toEqual(['社員'])
})

test('loadValidatedModel - prefers file over value', () => {
  const { sourcePath } = loadValidatedModel(validSource, 'ignored-value')

  expect(sourcePath).toBe(validSource)
})

test('loadValidatedModel - exits the process when YAML schema validation fails', () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called')
  })

  expect(() => loadValidatedModel(undefined, fixture('invalid-schema.yml'))).toThrow('process.exit called')
  expect(exit).toHaveBeenCalledWith(1)

  exit.mockRestore()
})

test('loadValidatedModel - exits the process when the resolved model has errors', () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called')
  })

  expect(() => loadValidatedModel(undefined, fixture('duplicate-actor.yml'))).toThrow('process.exit called')
  expect(exit).toHaveBeenCalledWith(1)

  exit.mockRestore()
})
