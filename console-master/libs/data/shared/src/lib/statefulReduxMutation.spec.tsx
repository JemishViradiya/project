/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { Dispatch } from 'redux'

import { act, renderHook } from '@testing-library/react-hooks'

import { DogDataLayer } from '../../docs/redux/dog'
import { ActionTypes } from '../../docs/redux/dog/types'
import { UesDecorator as wrapper } from '../../docs/redux/support'
import type { ReduxMutation, ReduxMutationOptions, ReduxMutationState } from './statefulReduxMutation'
import { useStatefulReduxMutation } from './statefulReduxMutation'

jest.mock('./mockContext', () => ({
  useMock: jest.fn((arg1, arg2) => arg1?.mock || arg2?.mock),
}))

declare type DogVariables = DogDataLayer.DogVariables

async function testWithLoading<R, T>(query: ReduxMutation<R, T>, initialProps: ReduxMutationOptions<T>) {
  const api = renderHook<typeof initialProps, ReduxMutationState<R, T>>(opts => useStatefulReduxMutation(query, opts), {
    wrapper,
    initialProps,
  })

  const [action, { loading }] = api.result.current
  expect(loading).not.toBe(true)

  await act(() => action())
  expect(api.result.current[1].loading).toBe(true)

  act(() => jest.runAllTimers())
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

describe('useStatefulReduxMutation', () => {
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
    const api = renderHook(
      () =>
        useStatefulReduxMutation(dataLayer, {
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

  test('MockReduxMutation', async () => {
    const { mockMutationFn, ...rest } = DogDataLayer.mutateDog
    const dataLayer: typeof DogDataLayer.mutateDog = {
      ...rest,
      mock: true as const,
      mockMutation: jest.fn((variables: DogVariables) => (dispatch: Dispatch) => {
        dispatch({ type: ActionTypes.fetch, payload: variables })
        setTimeout(
          () =>
            dispatch({
              type: ActionTypes.success,
              payload: { id: '1', name: 'Buck', breed: 'mock.bulldog' },
              meta: variables,
            }),
          300,
        )
      }),
    }
    const api = renderHook(
      () =>
        useStatefulReduxMutation(dataLayer, {
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
    expect(dataLayer.mockMutation).toHaveBeenCalledWith({ name: 'Buck' }, expect.objectContaining({ mock: true }))
  })
})
