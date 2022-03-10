/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { useMock } from './mockContext'
import type { AbstractMutation } from './statefulCommon'

export type AsyncMutation<Result, Args> = AbstractMutation<(args?: Args) => Promise<Result>, Args, Result>

export type AsyncMutationOptions<_Result, Args extends unknown> = {
  variables?: Args
  mock?: true | undefined
}

export type AsyncMutationState<Result, Args> = [
  (variables?: Args) => void | Promise<unknown>,
  {
    loading: boolean
    data?: Result
    error?: Error
    future: Promise<unknown>
  },
]

/**
 * Provides a AsyncQueryState<Result> tracking a mutation lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param opts {AsyncMutation<Result, Args>}
 * @param opts {AsyncMutationOptions<Result, Arg>}
 */
export function useStatefulAsyncMutation<Result, Args extends unknown>(
  mutationParam: AsyncMutation<Result, Args>,
  opts: AsyncMutationOptions<Result, Args> = {},
): AsyncMutationState<Result, Args> {
  const { mutation, mockMutationFn, defaultVariables } = mutationParam
  const [renderId, setRenderId] = React.useState(1)
  const mount = React.useRef<boolean>(false)
  const mockMe = useMock(mutationParam, opts)
  const variablesParam = opts.variables ?? defaultVariables
  const variables = React.useRef<Args>(variablesParam)
  React.useEffect(() => {
    variables.current = variablesParam
  }, [variablesParam])

  React.useEffect(() => {
    mount.current = true
    return () => {
      mount.current = false
    }
  }, [])

  const _mutation = React.useMemo(
    () =>
      mockMe
        ? (args: Args): Promise<Result> =>
            new Promise(resolve => {
              setTimeout(() => resolve(mockMutationFn(args)), 1000)
            })
        : mutation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutation, mockMutationFn, mockMe],
  )

  const action = React.useCallback(
    (varsArg?: Args) => {
      setRenderId(id => id + 1)
      setState(({ error, data, ...state }) => ({ ...state, loading: true }))
      const future =
        renderId &&
        new Promise(resolve => {
          _mutation(varsArg || variables.current)
            .then(data => ({ data }))
            .catch(error => ({ error }))
            .then(futureState => {
              if (!mount.current) return
              setState(({ error, ...state }) => {
                const nextState = {
                  ...state,
                  ...futureState,
                  future,
                  loading: false,
                  refetch: () => setRenderId(id => id + 1),
                }
                resolve(nextState)
                return nextState
              })
            })
        })
      return future
    },
    [_mutation, renderId],
  )

  const [state, setState] = React.useState(
    () =>
      ({
        loading: false,
      } as AsyncMutationState<Result, Args>[1]),
  )

  return [action, state]
}
