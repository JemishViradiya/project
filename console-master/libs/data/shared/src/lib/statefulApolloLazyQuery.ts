import { useCallback, useState } from 'react'

import type { OperationVariables, QueryFunctionOptions, QueryTuple } from '@apollo/client'
import { useLazyQuery } from '@apollo/client'

import { useCompareMemoize } from './hooks/useCompareMemoize'
import { useMock } from './mockContext'
import type { ApolloQueryOptions } from './statefulApolloCommon'
import { mockQueryState } from './statefulApolloCommon'
import type { ApolloQuery } from './statefulCommon'

export type ApolloLazyQueryState<Result, Args = OperationVariables> = QueryTuple<Result, Args>

/**
 * Provides a ApolloLazyQueryState<Result> tracking a lazy query lifecycle
 *
 * 1. Renders with [triggerFn, { called: false, loading: false, data?: Result }]
 * 2. Once triggered, renders with [triggerFn, { called: true, loading: true, data?: Result }]
 * 3. Success renders with [triggerFn, { called: true, loading: false, data: Result }]
 * 4. Failure renders with [triggerFn, { called: true, loading: false, error: Error, data?: Result }]
 *
 * @param queryParam {ApolloQuery<Result, Args>}
 * @param opts {QueryFunctionOptions<Result, Args>}
 */
export function useStatefulApolloLazyQuery<Result, Args extends unknown = OperationVariables>(
  queryParam: ApolloQuery<Result, Args>,
  options: ApolloQueryOptions<Result, Args> = {},
): ApolloLazyQueryState<Result, Args> {
  const { query, mockQueryFn, defaultVariables, context, displayName } = queryParam
  const ops: QueryFunctionOptions<Result, Args> = { ...options, context }

  const mockMe = useMock(queryParam)
  if (mockMe) {
    ops.skip = true
  }
  const [mockTriggered, setMockTriggered] = useState(false)
  const mockTrigger = useCallback(() => {
    setMockTriggered(true)
    if (options?.onCompleted) {
      options?.onCompleted(mockQueryFn(options.variables))
    }
  }, [mockQueryFn, options])

  ops.variables = useCompareMemoize(ops.variables ?? defaultVariables)
  if (displayName && ops.displayName === undefined) {
    ops.displayName = displayName
  }

  const [queryTriggerFn, queryResult] = useLazyQuery<Result, Args>(query, ops)
  if (!mockMe) {
    return [queryTriggerFn, queryResult]
  }

  if (!mockQueryFn) {
    throw new Error('Query does not provide a mock (mockQueryFn)')
  }

  return [mockTrigger, mockQueryState(mockQueryFn, ops, !mockTriggered)]
}
