import { get } from 'lodash-es'
import React from 'react'
import type { DefaultRootState } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import { UesReduxStore } from '../providers/redux'
import type { UesReduxSlices } from '../providers/redux/slices'
import { useCompareMemoize } from './hooks/useCompareMemoize'
import { useMock } from './mockContext'
import type { AbstractQuery, AbstractQueryOptions, StatefulResult } from './statefulCommon'
import { mockStatefulResult } from './statefulCommon'

export type ReduxQueryType<Args> = (
  variables?: Args,
  opts?: {
    mock?: boolean
    optimistic?: ReduxQueryOptions<Args>['optimistic']
  },
) => unknown

declare type PropNamesOfType<T, PropType> = {
  [K in keyof T]: T[K] extends PropType ? K : never
}[keyof T]

export interface ReduxQuery<Result, Args extends unknown, Selected = StatefulResult<Result>>
  extends AbstractQuery<ReduxQueryType<Args>, Args, Result> {
  mockQuery?: ReduxQueryType<Args>
  mockQueryFn?: (args?: Partial<Args>) => Result
  selector: (args?: Partial<Args>) => (state: DefaultRootState) => Selected extends infer T ? T : never
  equalityFn?: (left: Selected, right: Selected) => boolean
  dataProp?: PropNamesOfType<Selected, Result> | string | null
  errorProp?: PropNamesOfType<Selected, Error>
  loadingProp?: PropNamesOfType<Selected, boolean>
  slice?: UesReduxSlices
}

export interface ReduxQueryOptions<Args extends unknown> extends Partial<AbstractQueryOptions<Args>> {
  variables?: Args
  optimistic?: boolean
  skip?: boolean
  noDataExpected?: boolean
  mock?: true | undefined
}

export type ReduxQueryState<Result, Args extends unknown> = {
  loading: boolean
  data?: Result
  error?: Error
  refetch: (variables?: Args) => unknown | Promise<unknown>
  fetchMore: (variable?: Args) => unknown | Promise<unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const skipSelector = (args: any): any => undefined

const thenOrNow = (sub: PromiseLike<unknown> | void, cb: () => unknown) => {
  if (sub && sub.then) {
    return sub.then(cb)
  }
  return cb()
}

/**
 * Provides a ReduxQueryState<Result, Args> tracking a query lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param queryParam {ReduxQuery<Result, Args, Selected>}
 * @param opts {ReduxQueryOptions<Args>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useStatefulReduxQuery<Result, Args extends unknown, State, Selected>(
  queryParam: ReduxQuery<Result, Args, Selected>,
  opts: ReduxQueryOptions<Args> = {},
): ReduxQueryState<Result, Args> {
  const {
    selector,
    equalityFn,
    mockQuery,
    mockQueryFn,
    loadingProp = 'loading',
    errorProp = 'error',
    dataProp = 'data',
    defaultVariables,
    slice,
  } = queryParam
  const { optimistic, skip, noDataExpected = false } = opts
  const variables = useCompareMemoize(opts.variables ?? defaultVariables)
  const dispatch = useDispatch()
  const result = useSelector<State, Selected>(skip ? skipSelector : selector(variables), equalityFn)
  const ref = React.useRef<boolean>()
  const mockMe = useMock(queryParam, opts)
  const variablesRef = React.useRef(variables)
  const [fetchMoreVariables, setFetchMoreVariables] = React.useState(variables)
  const query = (mockMe && mockQuery) || queryParam.query
  const shouldMockState = mockMe && mockQueryFn

  const refetch = React.useCallback(
    (vars: Args = variablesRef.current): unknown | PromiseLike<unknown> => {
      if (!shouldMockState) {
        ref.current = true
        return thenOrNow(slice && UesReduxStore.mountSlice(slice, true), () =>
          dispatch(typeof query === 'function' ? query(vars, { mock: mockMe, optimistic }) : query),
        )
      } else {
        setFetchMoreVariables(vars)
      }
    },
    [shouldMockState, slice, dispatch, query, mockMe, optimistic],
  )

  const fetchMore = React.useCallback(
    variables => {
      if (!shouldMockState) {
        dispatch(typeof query === 'function' ? query(variables, { mock: mockMe, optimistic }) : query)
      } else {
        setFetchMoreVariables(variables)
      }
    },
    [shouldMockState, dispatch, query, mockMe, optimistic],
  )

  React.useEffect(() => {
    if (!skip && !shouldMockState) {
      ref.current = true
      thenOrNow(slice && UesReduxStore.mountSlice(slice, true), () =>
        dispatch(typeof query === 'function' ? query(variables, { mock: mockMe, optimistic }) : query),
      )
    }
  }, [variables, dispatch, query, mockMe, optimistic, skip, shouldMockState, slice])

  if (shouldMockState) {
    if (window.CYPRESS_CI_TESTING && queryParam.id && window.model?._mocks[queryParam.id]) {
      const mock = window.model._mocks[queryParam.id]
      if (mock.error) {
        throw Object.assign(new Error((mock.error.message as string) || 'MockError'), mock.error)
      } else {
        return {
          loading: false,
          ...(skip || !mockQueryFn ? undefined : mockStatefulResult(() => mock.data as Result)),
          refetch,
          fetchMore,
        }
      }
    }

    return {
      loading: false,
      ...(skip || !mockQueryFn ? undefined : mockStatefulResult(() => mockQueryFn(fetchMoreVariables))),
      refetch,
      fetchMore,
    }
  }

  const data = result && dataProp ? get(result, dataProp) : result
  if (!ref.current && !optimistic) {
    return {
      loading: !skip,
      data,
      refetch,
      fetchMore,
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const error = result && result[errorProp]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const loading = noDataExpected ? false : !data || !result || result[loadingProp]

  return {
    loading: loading && !error,
    data,
    error,
    refetch,
    fetchMore,
  }
}
