import { isEqual } from 'lodash-es'
import React from 'react'

import type { ApolloError, DocumentNode, OperationVariables } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { useCompareMemoize } from './hooks/useCompareMemoize'
import { useMock } from './mockContext'
import type { ApolloSubscriptionOptions } from './statefulApolloCommon'
import { mockQueryState } from './statefulApolloCommon'
import type { ApolloQueryState } from './statefulApolloQuery'
import type { AbstractSubscription, ApolloSubscription } from './statefulCommon'

const useSubscriptionQuery = <QueryResult, SubscriptionResult, Args>(
  { query, subscription, updateQuery }: AbstractSubscription<DocumentNode, Args, QueryResult, SubscriptionResult>,
  options: ApolloSubscriptionOptions<QueryResult, Args>,
): ApolloQueryState<QueryResult, Args> => {
  const { context, skip, variables } = options
  const result = useQuery(query, options)
  const { subscribeToMore } = result

  const [error, setError] = React.useState<ApolloError>()
  React.useEffect(() => {
    if (skip) {
      return
    }
    if (error && process.env.NODE_ENV !== 'test') {
      console.warn('Resubscribing after error:', error.message || error)
    }
    return subscribeToMore<SubscriptionResult, Args>({
      document: subscription,
      variables,
      updateQuery,
      onError: (apolloError: ApolloError) => {
        if (!isEqual(error, apolloError)) {
          setError(apolloError)
        }
      },
      context,
    })
  }, [subscribeToMore, subscription, updateQuery, variables, context, skip, error])

  result.error = result.error || error
  return result
}

/**
 * Provides a ApolloQueryState<QueryResult> tracking a query lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param queryParam {ApolloSubscription<QueryResult, SubscriptionResult, Args>}
 * @param opts {ApolloSubscriptionOptions<QueryResult, Arg>}
 */
export function useStatefulApolloSubscription<QueryResult, SubscriptionResult, Args extends unknown = OperationVariables>(
  queryParam: ApolloSubscription<QueryResult, SubscriptionResult, Args>,
  options: ApolloSubscriptionOptions<QueryResult, Args> = {},
): ApolloQueryState<QueryResult, Args> {
  const { mockQueryFn, defaultVariables, displayName, context } = queryParam
  const ops: ApolloSubscriptionOptions<QueryResult, Args> = { ...options, context }

  const mockMe = useMock(queryParam)
  if (mockMe) {
    ops.skip = true
  }
  ops.displayName = displayName
  ops.variables = useCompareMemoize(ops.variables ?? defaultVariables)

  const queryResult = useSubscriptionQuery(queryParam, ops)
  if (!mockMe) {
    return queryResult
  }

  if (!mockQueryFn) {
    throw new Error('Query does not provide a mock (mockQueryFn)')
  }
  return mockQueryState(mockQueryFn, ops)
}
