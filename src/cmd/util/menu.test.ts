import { beforeEach, expect, jest, test } from '@jest/globals'

jest.mock('@inquirer/select', () => jest.fn<void, []>())

import select from '@inquirer/select'
import { runMenu } from './menu'

const mockSelect = select as unknown as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

test('runMenu - runs the action matching the selected label', async () => {
  mockSelect.mockResolvedValueOnce('B')
  const actionA = jest.fn<void, []>()
  const actionB = jest.fn<void, []>()

  await runMenu([
    { label: 'A', action: actionA },
    { label: 'B', action: actionB },
  ])

  expect(actionA).not.toHaveBeenCalled()
  expect(actionB).toHaveBeenCalledTimes(1)
})

test('runMenu - passes item labels as choices and the given pageSize', async () => {
  mockSelect.mockResolvedValueOnce('A')

  await runMenu([
    { label: 'A', action: jest.fn<void, []>() },
    { label: 'B', action: jest.fn<void, []>() },
  ], 3)

  expect(mockSelect).toHaveBeenCalledWith(
    expect.objectContaining({
      choices: [{ name: 'A', value: 'A' }, { name: 'B', value: 'B' }],
      pageSize: 3,
    }),
    expect.anything(),
  )
})

test('runMenu - defaults pageSize to 5', async () => {
  mockSelect.mockResolvedValueOnce('A')

  await runMenu([{ label: 'A', action: jest.fn<void, []>() }])

  expect(mockSelect).toHaveBeenCalledWith(
    expect.objectContaining({ pageSize: 5 }),
    expect.anything(),
  )
})
