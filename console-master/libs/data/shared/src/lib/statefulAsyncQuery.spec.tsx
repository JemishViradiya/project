/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux'

import { act, renderHook } from '@testing-library/react-hooks'

import { DogDataLayer } from '../../docs/async'
import type { AsyncQuery, AsyncQueryOptions, AsyncQueryState } from './statefulAsyncQuery'
import { useStatefulAsyncQuery } from './statefulAsyncQuery'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockData = require('../../docs/mockdata.json')

jest.mock('./mockContext', () => ({
  useMock: jest.fn(({ mock = false } = {}) => mock),
}))

async function testWithLoading<R, T>(query: AsyncQuery<R, T>, initialProps: AsyncQueryOptions<R, T>) {
  const api = renderHook<typeof initialProps, AsyncQueryState<R, T>>(opts => useStatefulAsyncQuery(query, opts), {
    initialProps,
  })

  await act(async () => jest.runAllTimers())
  expect(api.result.current.loading).not.toBe(true)

  return api
}
const Buck = {
  id: '1',
  name: 'Buck',
  breed: 'bulldog',
}
const BuckCached = {
  ...Buck,
  breed: 'cached',
}
const DudCached = {
  id: '1',
  name: 'Dud',
  breed: 'cached',
}
const MockBuck = {
  ...Buck,
  breed: 'mock.bulldog',
}

describe('useStatefulAsyncQuery', () => {
  beforeEach(() => jest.useFakeTimers())

  test('SimpleQuery', async () => {
    const { data } = (
      await testWithLoading(DogDataLayer.queryDog, {
        variables: { name: 'Buck' },
      })
    ).result.current
    expect(data).toEqual(Buck)
  })

  test('DefaultVariables', async () => {
    const dataLayer = {
      ...DogDataLayer.queryDog,
      defaultVariables: { name: 'Buck' },
    }
    const { data } = (await testWithLoading(dataLayer, {})).result.current
    expect(data).toEqual(Buck)
  })

  test('OnDemandQuery', async () => {
    const { result, rerender } = await testWithLoading(DogDataLayer.queryDog, {
      variables: { name: 'Buck' },
      skip: true,
    })
    expect(result.current.data).toEqual(undefined)

    rerender({
      variables: { name: 'Buck' },
    })
    await act(async () => jest.runAllTimers())
    expect(result.current.data).toEqual(Buck)
  })

  test('FailureQuery', async () => {
    const { error } = (
      await testWithLoading(DogDataLayer.queryDog, {
        variables: { name: 'Dud' },
      })
    ).result.current

    expect(() => {
      throw error
    }).toThrowError('Not Found')
  })

  test('MockQuery', async () => {
    const dataLayer = { ...DogDataLayer.queryDog, mock: true as const }
    const { data } = (
      await testWithLoading(dataLayer, {
        variables: { name: 'Buck' },
      })
    ).result.current

    expect(data).toEqual(MockBuck)
  })

  test('MoreQuery', async () => {
    const { result, rerender } = await testWithLoading(DogDataLayer.listDogsProgressively, {
      variables: { limit: 3, offset: 0 },
    })
    const firstResult = result.current.data
    expect(firstResult).toHaveLength(3)
    expect(firstResult).toEqual(mockData.data.slice(0, 3))

    const variables = {
      limit: 3,
      offset: 3,
    }

    const subsequestResultPromise = result.current.fetchMore(variables)
    await act(async () => jest.runAllTimers())

    const subsequestResult = await subsequestResultPromise
    expect(subsequestResult).toHaveLength(3)
    expect(subsequestResult).toEqual(mockData.data.slice(3, 6))
  })

  test('QueryCached', async () => {
    const { result, rerender } = await testWithLoading(DogDataLayer.queryDogWithCache, {
      variables: { name: 'Buck' },
    })
    const cachedResult = result.current.data
    expect(cachedResult).toEqual(BuckCached)

    await act(async () => jest.runAllTimers())

    const fetchedResult = result.current.data
    expect(fetchedResult).toEqual(Buck)
  })

  test('QueryCachedFailure', async () => {
    const { result, rerender } = await testWithLoading(DogDataLayer.queryDogWithCache, {
      variables: { name: 'Dud' },
    })
    const cachedResult = result.current.data
    expect(cachedResult).toEqual(DudCached)

    await act(async () => jest.runAllTimers())

    const errorResponse = result.current.error
    expect(() => {
      throw errorResponse
    }).toThrowError('Not Found')
  })
})
