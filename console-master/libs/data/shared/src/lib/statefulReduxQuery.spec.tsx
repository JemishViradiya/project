/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch } from 'redux'

import { act, renderHook } from '@testing-library/react-hooks'

import { DogDataLayer } from '../../docs/redux/dog'
import { ActionTypes as DogActionTypes } from '../../docs/redux/dog/types'
import { DogsDataLayer } from '../../docs/redux/dogs'
import { UesDecorator as wrapper } from '../../docs/redux/support'
import type { ReduxQuery, ReduxQueryOptions, ReduxQueryState } from './statefulReduxQuery'
import { useStatefulReduxQuery } from './statefulReduxQuery'

jest.mock('./mockContext', () => ({
  useMock: jest.fn(({ mock = false } = {}) => mock),
}))

type DogVariables = DogDataLayer.DogVariables
type Dog = DogDataLayer.Dog

function testWithLoading<R, T>(query: ReduxQuery<R, T>, initialProps: ReduxQueryOptions<T>) {
  const api = renderHook<typeof initialProps, ReduxQueryState<R, T>>(opts => useStatefulReduxQuery(query, opts), {
    wrapper,
    initialProps,
  })

  const { loading } = api.result.current
  expect(loading).toBe(true)

  act(() => jest.runAllTimers())
  expect(api.result.current.loading).not.toBe(true)

  return api
}
const Buck = {
  id: '1',
  name: 'Buck',
  breed: 'bulldog',
}
const MockBuck = {
  ...Buck,
  breed: 'mock.bulldog',
}

describe('useStatefulReduxQuery', () => {
  beforeEach(() => jest.useFakeTimers())

  test('SimpleQuery', async () => {
    const { data } = testWithLoading(DogDataLayer.queryDog, {
      variables: { name: 'Buck' },
    }).result.current
    expect(data).toEqual(Buck)
  })

  test('DefaultVariables', async () => {
    const dataLayer = {
      ...DogDataLayer.queryDog,
      defaultVariables: { name: 'Buck' },
    }
    const { data } = testWithLoading(dataLayer, {}).result.current
    expect(data).toEqual(Buck)
  })

  test('OnDemandQuery', async () => {
    const { result, rerender } = renderHook<ReduxQueryOptions<DogVariables>, ReduxQueryState<Dog, DogVariables>>(
      opts => useStatefulReduxQuery(DogDataLayer.queryDog, opts),
      {
        wrapper,
        initialProps: {
          variables: {},
          skip: true,
        } as ReduxQueryOptions<DogVariables>,
      },
    )

    rerender({
      variables: { name: 'Buck' },
    })
    act(() => jest.runAllTimers())
    expect(result.current.data).toEqual(Buck)
  })

  test('FailureQuery', async () => {
    const { error } = testWithLoading(DogDataLayer.queryDog, {
      variables: { name: 'Dud' },
    }).result.current

    expect(() => {
      throw error
    }).toThrowError('Not Found')
  })

  test('MockQuery', async () => {
    const dataLayer = { ...DogDataLayer.queryDog, mock: true as const }
    const { data } = renderHook(
      () =>
        useStatefulReduxQuery(dataLayer, {
          variables: { name: 'Buck' },
        }),
      {
        wrapper,
      },
    ).result.current

    expect(data).toEqual(MockBuck)
  })

  test('MockReduxQuery', async () => {
    const { mockQueryFn, ...rest } = DogDataLayer.queryDog
    const dataLayer: typeof DogDataLayer.queryDog = {
      ...rest,
      mock: true as const,
      mockQuery: jest.fn((variables: DogVariables) => (dispatch: Dispatch) => {
        dispatch({ type: DogActionTypes.fetch, payload: variables })
        setTimeout(
          () =>
            dispatch({
              type: DogActionTypes.success,
              payload: { id: '1', name: 'Buck', breed: 'mock.bulldog' },
              meta: variables,
            }),
          300,
        )
      }),
    }
    const api = renderHook(
      () =>
        useStatefulReduxQuery(dataLayer, {
          variables: { name: 'Buck' },
        }),
      {
        wrapper,
      },
    )
    expect(api.result.current.loading).toBe(true)

    await act(async () => {
      jest.runAllTimers()
    })

    const { data, loading } = api.result.current
    expect(loading).not.toBe(true)
    expect(data).toEqual(MockBuck)
    expect(dataLayer.mockQuery).toHaveBeenCalledWith({ name: 'Buck' }, expect.objectContaining({ mock: true }))
  })

  test('MoreQuery', async () => {
    const api = testWithLoading(DogsDataLayer.listDogsProgressively, {
      variables: { limit: 3, offset: 0 },
    })
    const { result } = api
    expect(result.current.data.data).toHaveLength(3)

    const variables = {
      limit: 3,
      offset: 3,
    }

    act(() => {
      result.current.fetchMore(variables)
      jest.runAllTimers()
    })

    expect(result.current.data.data).toHaveLength(6)
  })

  test('PageQuery', async () => {
    const api = testWithLoading(DogsDataLayer.listDogsByPage, {
      variables: { limit: 3, page: 1 },
    })
    const { result } = api
    expect(result.current.data.data).toHaveLength(3)

    const variables = {
      limit: 3,
      page: 2,
    }

    act(() => {
      result.current.fetchMore(variables)
      jest.runAllTimers()
    })

    expect(result.current.data.data).toHaveLength(3)
    expect(result.current.data.pageInfo).toEqual(
      expect.objectContaining({
        page: 2,
        limit: 3,
        prev: 1,
        next: 3,
      }),
    )
  })

  test('RerenderQuery', async () => {
    const { result } = testWithLoading(DogDataLayer.queryDog, {
      variables: { name: 'Buck' },
    })

    act(() => {
      result.current.refetch()
      jest.runAllTimers()
    })

    expect(result.current.data).toEqual(Buck)
  })
})
