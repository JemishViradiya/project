/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'

import { DogDataLayer, DogsDataLayer } from '../../docs/apollo'
import { UesDecorator as wrapper } from '../../docs/apollo/support'
import type { ApolloQueryOptions } from './statefulApolloCommon'
import type { ApolloLazyQueryState } from './statefulApolloLazyQuery'
import { useStatefulApolloLazyQuery } from './statefulApolloLazyQuery'
import type { ApolloQueryState } from './statefulApolloQuery'
import { useStatefulApolloQuery } from './statefulApolloQuery'
import type { ApolloQuery } from './statefulCommon'

jest.mock('./mockContext', () => ({
  useMock: jest.fn(({ mock = false } = {}) => mock),
}))

async function testWithLoading<R, T>(query: ApolloQuery<R, T>, initialProps: ApolloQueryOptions<R, T>) {
  const api = renderHook<typeof initialProps, ApolloQueryState<R, T>>(opts => useStatefulApolloQuery(query, opts), {
    wrapper,
    initialProps,
  })

  const { loading } = api.result.current
  expect(loading).toBe(true)

  await act(async () => jest.runAllTimers())
  expect(api.result.current.loading).not.toBe(true)

  return api
}
const Buck = {
  dog: {
    id: '1',
    name: 'Buck',
    breed: 'bulldog',
  },
}
const MockBuck = {
  dog: {
    ...Buck.dog,
    breed: 'mock.bulldog',
  },
}

describe('useStatefulReduxQuery', () => {
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
    const api = renderHook<
      ApolloQueryOptions<DogDataLayer.DogResult, DogDataLayer.DogVariables>,
      ApolloLazyQueryState<DogDataLayer.DogResult, DogDataLayer.DogVariables>
    >(opts => useStatefulApolloLazyQuery(DogDataLayer.queryDog, opts), {
      wrapper,
      initialProps: {
        variables: { name: 'Buck' },
        skip: true,
      },
    })

    const [action, { loading }] = api.result.current
    expect(loading).not.toBe(true)

    await act(async () => {
      await action()
      jest.runAllTimers()
    })
    expect(api.result.current[1].loading).not.toBe(true)
    expect(api.result.current[1].data).toEqual(Buck)
  })

  test('FailureQuery', async () => {
    const { error } = (
      await testWithLoading(DogDataLayer.queryDog, {
        variables: { name: 'Dud' },
      })
    ).result.current

    expect(() => {
      throw error
    }).toThrowError('aw shucks')
  })

  test('MockQuery', async () => {
    const dataLayer = { ...DogDataLayer.queryDog, mock: true as const }
    const { data } = renderHook(
      () =>
        useStatefulApolloQuery(dataLayer, {
          variables: { name: 'Buck' },
        }),
      {
        wrapper,
      },
    ).result.current

    expect(data).toEqual(MockBuck)
  })

  test('MoreQuery', async () => {
    const api = await testWithLoading(DogsDataLayer.listDogsProgressively, {
      variables: { limit: 3, offset: 0 },
    })
    const { result } = api
    expect(result.current.data.data).toHaveLength(3)

    const variables = {
      limit: 3,
      offset: 3,
    }

    await act(async () => {
      const p = result.current.fetchMore({ variables })
      jest.runAllTimers()
      await p
    })

    // TODO: how do we use an apollo-cache and apollo-mocks
    expect(result.current.data.data).toHaveLength(3)
  })

  test('PageQuery', async () => {
    const api = await testWithLoading(DogsDataLayer.listDogsByPage, {
      variables: { limit: 3, page: 1 },
    })
    const { result } = api
    expect(result.current.data.data).toHaveLength(3)

    const variables = {
      limit: 3,
      page: 2,
    }

    await act(async () => {
      const action = result.current.fetchMore({ variables })
      jest.runAllTimers()
      await action
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
    const { result } = await testWithLoading(DogDataLayer.queryDog, {
      variables: { name: 'Buck' },
    })

    act(() => {
      result.current.refetch()
      jest.runAllTimers()
    })

    expect(result.current.data).toEqual(Buck)
  })
})
