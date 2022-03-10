/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'

import { DogDataLayer } from '../../docs/apollo'
import { UesDecorator as wrapper } from '../../docs/apollo/support'
import type { ApolloMutation, ApolloMutationOptions, ApolloMutationState } from './statefulApolloMutation'
import { useStatefulApolloMutation } from './statefulApolloMutation'

jest.mock('./mockContext', () => ({
  useMock: jest.fn((arg1, arg2) => arg1?.mock || arg2?.mock),
}))

async function testWithLoading<R, T>(query: ApolloMutation<R, T>, initialProps: ApolloMutationOptions<R, T>) {
  const api = renderHook<typeof initialProps, ApolloMutationState<R, T>>(opts => useStatefulApolloMutation(query, opts), {
    wrapper,
    initialProps,
  })

  const [action, { loading }] = api.result.current
  expect(loading).not.toBe(true)

  await act(async () => {
    const lazy = action()
    jest.runAllTimers()
    try {
      return await lazy
    } catch (err) {
      return err
    }
  })
  expect(api.result.current[1].loading).not.toBe(true)
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

describe('useStatefulApolloMutation', () => {
  beforeEach(() => jest.useFakeTimers())

  test('SimpleMutation', async () => {
    const [, { data }] = (
      await testWithLoading(DogDataLayer.mutateDog, {
        variables: { name: 'Buck' },
      })
    ).result.current

    expect(data).toEqual(Buck)
  })

  test('DefaultVariables', async () => {
    const [, { data }] = (
      await testWithLoading(
        {
          ...DogDataLayer.mutateDog,
          defaultVariables: { name: 'Buck' },
        },
        {},
      )
    ).result.current
    expect(data).toEqual(Buck)
  })

  test('FailureMutation', async () => {
    const [, { error }] = (
      await testWithLoading(DogDataLayer.mutateDog, {
        variables: { name: 'Dud' },
      })
    ).result.current

    expect(() => {
      throw error
    }).toThrowError('aw shucks')
  })

  test('MockMutation', async () => {
    const dataLayer = {
      ...DogDataLayer.mutateDog,
      mock: true as const,
    }
    const api = renderHook(
      () =>
        useStatefulApolloMutation(dataLayer, {
          variables: { name: 'Buck' },
        }),
      {
        wrapper,
      },
    )
    const [action] = api.result.current
    expect(api.result.current[1].loading).not.toBe(true)

    await act(async () => {
      action()
      jest.runAllTimers()
    })

    const [, { data, loading }] = api.result.current
    expect(loading).not.toBe(true)
    expect(data).toEqual(MockBuck)
  })
})
