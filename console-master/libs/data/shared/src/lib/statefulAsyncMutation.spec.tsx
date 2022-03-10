/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'

import { DogDataLayer } from '../../docs/async'
import type { AsyncMutation, AsyncMutationOptions, AsyncMutationState } from './statefulAsyncMutation'
import { useStatefulAsyncMutation } from './statefulAsyncMutation'

jest.mock('./mockContext', () => ({
  useMock: jest.fn((arg1, arg2) => arg1?.mock || arg2?.mock),
}))

declare type DogVariables = DogDataLayer.DogVariables

async function testWithLoading<R, T>(query: AsyncMutation<R, T>, initialProps: AsyncMutationOptions<R, T>) {
  const api = renderHook<typeof initialProps, AsyncMutationState<R, T>>(opts => useStatefulAsyncMutation(query, opts), {
    initialProps,
  })

  const [action, { loading }] = api.result.current
  expect(loading).not.toBe(true)

  await act(async () => {
    const r = action()
    jest.runAllTimers()
    await r
  })

  expect(api.result.current[1].loading).not.toBe(true)
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

describe('useStatefulAsyncMutation', () => {
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
    }).toThrowError('Not Found')
  })

  test('MockMutation', async () => {
    const dataLayer = {
      ...DogDataLayer.mutateDog,
      mock: true as const,
    }
    const api = renderHook(() =>
      useStatefulAsyncMutation(dataLayer, {
        variables: { name: 'Buck' },
      }),
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
