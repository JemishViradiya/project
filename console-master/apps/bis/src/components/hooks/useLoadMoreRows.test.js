import { renderHook } from '@testing-library/react-hooks'

import useLoadMoreRows from './useLoadMoreRows'

describe('useLoadMoreRows', () => {
  const requestFactory = length => ({
    variables: { sortBy: 'datetime', sortDirection: 'ASC' },
    data: new Array(length),
    total: 1200,
    fetchMore: jest.fn(),
  })
  const options = { key: 'testKey', dataKey: 'testDataKey' }

  const testLoadMoreRows = async ({ startIndex, stopIndex, length = startIndex }) => {
    const request = requestFactory(length)
    request.fetchMore.mockResolvedValue()

    const {
      result: { current: loadMoreRows },
    } = renderHook(() => useLoadMoreRows(request, options))
    await loadMoreRows({ startIndex, stopIndex })

    return request
  }

  test('Loads more rows < batch size', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 30 })

    expect(request.fetchMore).toBeCalledWith(
      expect.objectContaining({
        variables: {
          ...request.variables,
          offset: 10,
          size: 50,
        },
      }),
    )
  })

  test('Loads more rows > batch size', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 64 })

    expect(request.fetchMore).toBeCalledWith(
      expect.objectContaining({
        variables: {
          ...request.variables,
          offset: 10,
          size: 100,
        },
      }),
    )
  })

  test('resets when length < startIndex', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 64, length: 0 })

    expect(request.fetchMore).toBeCalledWith(
      expect.objectContaining({
        variables: {
          ...request.variables,
          offset: 0,
          size: 100,
        },
      }),
    )
  })

  test('resets with batch considerations when  length < startIndex', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 100, length: 0 })

    expect(request.fetchMore).toBeCalledWith(
      expect.objectContaining({
        variables: {
          ...request.variables,
          offset: 0,
          size: 150,
        },
      }),
    )
  })

  test('skip when at the end', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 64, length: 1200 })
    expect(request.fetchMore).not.toBeCalledWith()
  })

  test('skip when already loaded', async () => {
    const request = await testLoadMoreRows({ startIndex: 10, stopIndex: 64, length: 100 })
    expect(request.fetchMore).not.toBeCalledWith()
  })

  test('waits for pending request (1)', async () => {
    const request = requestFactory()
    request.fetchMore.mockResolvedValue()

    const {
      result: { current: loadMoreRows },
    } = renderHook(() => useLoadMoreRows(request, options))
    await loadMoreRows({ startIndex: 10, stopIndex: 32 })

    expect(request.fetchMore).not.toBeCalledWith()
  })
})
