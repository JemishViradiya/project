/* eslint-disable @typescript-eslint/no-empty-function */
import type {
  ApolloError,
  DocumentNode,
  FetchPolicy,
  NetworkStatus,
  OperationVariables,
  QueryFunctionOptions,
  QueryResult,
  SubscribeToMoreOptions,
} from '@apollo/client'

import type { AbstractQueryOptions } from './statefulCommon'

export interface ApolloQueryOptions<Result, Args = OperationVariables>
  extends QueryFunctionOptions<Result, Args>,
    Partial<AbstractQueryOptions<Args>> {
  mock?: true | undefined
  exportFetchPolicy?: FetchPolicy
}

export type ApolloSubscriptionOptions<Result, Args> = QueryFunctionOptions<Result, Args> & {
  subscription?: DocumentNode
}

export const mockStatefulResult = <T>(fn: () => T, options: ApolloQueryOptions<T>): { data: T } | { error: ApolloError } => {
  try {
    const data = fn()
    if (options?.onCompleted) {
      setTimeout(() => options.onCompleted(data), 0)
    }
    return { data }
  } catch (error) {
    if (options?.onError) {
      setTimeout(() => options.onError(error), 0)
    }
    return { error }
  }
}

export const mockQueryState = <Result, Args>(
  mockQuery: (variables: Args) => Result,
  options: ApolloQueryOptions<Result, Args>,
  lazy?: boolean,
): QueryResult<Result, Args> => ({
  ...mockStatefulResult(() => (lazy ? null : mockQuery(options.variables)), options),
  networkStatus: 7 as NetworkStatus,
  client: null,
  startPolling: (_interval: number) => {},
  stopPolling: () => {},
  subscribeToMore: (_options: SubscribeToMoreOptions<Result, unknown, unknown>) => () => {},
  updateQuery: () => {},
  variables: options.variables,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fetchMore: async ({ variables }) => ({
    loading: false,
    called: true,
    networkStatus: 7 as NetworkStatus,
    ...mockStatefulResult(() => mockQuery(variables), options),
  }),
  called: true,
  refetch: async (variables: Args) => ({
    ...mockStatefulResult(() => mockQuery(variables), options),
    data: undefined,
    loading: false,
    networkStatus: 7 as NetworkStatus,
  }),
})
