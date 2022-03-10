/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import type {
  Context,
  DocumentNode,
  MutationHookOptions,
  MutationResult,
  MutationTuple,
  MutationUpdaterFn,
  OperationVariables,
} from '@apollo/client'
import { useMutation } from '@apollo/client'

import { useMock } from './mockContext'
import { mockStatefulResult } from './statefulApolloCommon'
import type { AbstractMutation } from './statefulCommon'

export interface ApolloMutation<Result, Args extends unknown> extends AbstractMutation<DocumentNode, Args, Result> {
  context: Context
  optimisticResponse?: Result | ((vars: Args) => Result)
  update?: MutationUpdaterFn<Result>
}

export type ApolloMutationState<Result, Args = OperationVariables> = MutationTuple<Result, Args>

export type ApolloMutationOptions<Result, Args> = MutationHookOptions<Result, Args> & { mock?: true | undefined }

const mockMutationState = <Result, Args>(
  mockMutation: (variables: Args) => Result,
  onCompleted: (data: Result) => void,
  variables: Args,
  [mockState, setMockState]: [MutationResult<Result>, Dispatch<SetStateAction<MutationResult<Result>>>],
): ApolloMutationState<Result, Args> => [
  async (opts: ApolloMutationOptions<Result, Args> & { delay?: number } = {}) => {
    setMockState(state => ({ ...state, loading: true, called: true }))

    await new Promise(resolve => setTimeout(resolve, opts.delay || 1000))

    const nextState = mockStatefulResult(() => mockMutation(opts.variables || variables), opts)

    if ('data' in nextState && onCompleted) onCompleted(nextState.data)

    setMockState(state => ({ ...state, loading: false, called: true, ...nextState }))
    return 'data' in nextState ? nextState.data : undefined
  },
  mockState,
]

/**
 * Provides a ApolloMutationState<Result> tracking a query lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param mutationParam {ApolloMutation<Result, Args>}
 * @param opts {ApolloMutationOptions<Result, Args>}
 */
export function useStatefulApolloMutation<Result, Args extends unknown = OperationVariables>(
  mutationParam: ApolloMutation<Result, Args>,
  options: ApolloMutationOptions<Result, Args> = {},
): ApolloMutationState<Result, Args> {
  const { mutation, mockMutationFn, defaultVariables, context, optimisticResponse, update } = mutationParam
  const ops: ApolloMutationOptions<Result, Args> = { ...options, context }

  const mockMe = useMock(mutationParam, options)
  if (defaultVariables && !ops.variables) {
    ops.variables = defaultVariables
  }
  if (optimisticResponse && ops.optimisticResponse === undefined) {
    ops.optimisticResponse = optimisticResponse
  }
  if (update && ops.update === undefined) {
    ops.update = update
  }

  const mockState = useState({
    loading: false,
    called: false,
    client: null,
  })
  const shouldMockState = mockMe && mockMutationFn
  if (shouldMockState) {
    return mockMutationState(mockMutationFn, ops.onCompleted, ops.variables, mockState)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation<Result, Args>(mutation, ops)
}
