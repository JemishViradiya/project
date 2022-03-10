import type { OperationVariables, QueryFunctionOptions, QueryResult } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { usePermissions } from '../permissions/use-permissions'
import { useServiceEnabled } from '../service/serviceEnabledProvider'
import { useCompareMemoize } from './hooks/useCompareMemoize'
import { useMock } from './mockContext'
import type { ApolloQueryOptions } from './statefulApolloCommon'
import { mockQueryState } from './statefulApolloCommon'
import type { ApolloQuery } from './statefulCommon'
import { ApolloAction } from './statefulCommon'

export type { ApolloQueryOptions } from './statefulApolloCommon'

export type ApolloQueryState<Result, Args = OperationVariables> = QueryResult<Result, Args>

/**
 * Provides a ApolloQueryState<Result> tracking a query lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param queryParam {ApolloQuery<Result, Args>}
 * @param opts {QueryFunctionOptions<Result, Args>}
 */
export function useStatefulApolloQuery<Result, Args extends unknown = OperationVariables>(
  queryParam: ApolloQuery<Result, Args>,
  options: ApolloQueryOptions<Result, Args> = {},
): ApolloQueryState<Result, Args> {
  const {
    query,
    mockQueryFn,
    defaultVariables,
    context,
    displayName,
    onError,
    onCompleted,
    permissions,
    services,
    actions,
  } = queryParam
  const ops: QueryFunctionOptions<Result, Args> = { onError, onCompleted, ...options, context }

  const { hasPermission } = usePermissions()
  const { isEnabled } = useServiceEnabled()
  const mockMe = useMock(queryParam, options)
  const variables = ops.variables ?? defaultVariables
  const skipQuery =
    ops.skip ||
    (!!permissions &&
      actions?.has(ApolloAction.SKIP_WHEN_PERMISSIONS_NOT_MET) &&
      !hasPermission(permissions instanceof Set ? permissions : permissions(variables))) ||
    (!!services &&
      actions?.has(ApolloAction.SKIP_WHEN_SERVICE_NOT_ENABLED) &&
      Array.from(services).some(serviceId => !isEnabled(serviceId)))
  if (mockMe || skipQuery) {
    ops.skip = true
  }
  ops.variables = useCompareMemoize(variables)
  if (displayName && ops.displayName === undefined) {
    ops.displayName = displayName
  }

  const shouldMockState = mockMe && mockQueryFn
  const actualResult = useQuery<Result, Args>(query, ops)

  if (shouldMockState) {
    const mockResult = mockQueryState<Result, Args>(mockQueryFn, ops)
    if (window.CYPRESS_CI_TESTING && queryParam.id && window.model?._mocks[queryParam.id]) {
      return mockQueryState<Result, Args>(() => {
        const mock = window.model._mocks[queryParam.id]
        if (skipQuery) {
          return undefined
        } else if (mock.error) {
          throw Object.assign(new Error((mock.error.message as string) || 'MockError'), mock.error)
        } else {
          return mock.data as Result
        }
      }, ops)
    }
    return mockResult
  }

  return actualResult
}
