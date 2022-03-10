import usePromise from 'react-promise-suspense'

import { useMock } from './mockContext'
import type { AsyncQuery } from './statefulAsyncQuery'

type SuspenseQueryOptions<_Result, Args extends unknown> = {
  variables?: Args
  mock?: true | undefined
}

/**
 * Provides a query result loaded with Supsense
 *
 * 1. Returns a promise to suspend rendering
 * 2. Success renders with Result
 * 3. Failure throws an error needing to be caught with an ErrorBoundary
 *
 * @param queryParam {AsyncQuery<Result, Args>}
 * @param opts {SuspenseQueryOptions<Result, Args>}
 */
export function useSuspenseQuery<Result, Args extends unknown>(
  queryParam: AsyncQuery<Result, Args>,
  opts: SuspenseQueryOptions<Result, Args> = {},
): Result {
  const { query, mockQueryFn, defaultVariables } = queryParam
  const { variables = defaultVariables } = opts
  const mockMe = useMock(queryParam, opts)
  const promiseQuery = mockMe ? async (...args) => mockQueryFn(...args) : query
  const memoQuery = mockMe ? mockQueryFn : query
  // TODO: lifespan
  return usePromise(promiseQuery, [variables, memoQuery])
}
