import type { MutableRefObject } from 'react'
import React from 'react'
import { shallowEqual } from 'react-redux'

import { useCompareMemoize } from './hooks/useCompareMemoize'
import { useMock } from './mockContext'
import type { AbstractQuery, AbstractQueryOptions } from './statefulCommon'

interface AsyncGeneratorFactory<Args, Result> {
  (args?: Args): AsyncGenerator<Result, void>
}

export type AsyncQueryType<Result, Args> = ((args?: Args) => Promise<Result>) | AsyncGeneratorFactory<Args, Result>

export type AsyncQuery<Result, Args extends unknown = unknown> = Omit<
  AbstractQuery<AsyncQueryType<Result, Args>, Args, Result>,
  'mockQueryFn'
> & {
  mockQueryFn: ((args?: Args) => Promise<Result> | Result) | AsyncGeneratorFactory<Args, Result>
}

export interface AsyncQueryOptions<_Result, Args extends unknown> extends Partial<AbstractQueryOptions<Args>> {
  variables?: Args
  cache?: string
  mock?: true | undefined
  skip?: boolean
}

export type AsyncQueryState<Result, Args extends unknown> = {
  loading: boolean
  data?: Result
  error?: Error
  future: Promise<Result>
  refetch: () => void
  fetchMore: ((args?: Args) => Promise<Result> | Result) | AsyncGeneratorFactory<Args, Result>
}

const FutureCache = new WeakMap<Array<unknown>, AsyncGenerator<unknown, void>>()

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Provides a AsyncQueryState<Result> tracking a query lifecycle
 *
 * 1. Renders with { loading: true, data?: Result }
 * 2. Success renders with { loading: false, data: Result }
 * 3. Failure renders with { loading: false, error: Error, data?: Result }
 *
 * @param queryParam {AsyncQuery<Result, Args>}
 * @param opts {AsyncQueryOptions<Result, Arg>}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useStatefulAsyncQuery<Result, Args extends unknown>(
  queryParam: AsyncQuery<Result, Args>,
  opts: AsyncQueryOptions<Result, Args> = {},
): AsyncQueryState<Result, Args> {
  const { query, mockQueryFn, defaultVariables } = queryParam
  const { cache, skip } = opts
  const [renderId, setRenderId] = React.useState(1)
  const mount = React.useRef<1 | 0 | -1>(0)
  const mockMe = useMock(queryParam, opts)
  const variables = useCompareMemoize(opts.variables ?? defaultVariables)
  const fetchRef: MutableRefObject<Promise<Result & { dependencies?: unknown[] }>> = React.useRef<
    Promise<Result & { dependencies?: unknown[] }>
  >(null)

  const _query = React.useMemo(
    () => {
      if (mockMe) {
        if (window.CYPRESS_CI_TESTING && queryParam.id && window.model?._mocks[queryParam.id]) {
          return () => {
            const mock = window.model._mocks[queryParam.id]
            if (mock.error) {
              throw Object.assign(new Error((mock.error.message as string) || 'MockError'), mock.error)
            } else {
              return mock.data.result as Result
            }
          }
        }
        return mockQueryFn
      }
      return query
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, mockQueryFn, mockMe, variables],
  )

  const future = React.useMemo(() => {
    if (skip) {
      return null
    }
    if (cache) {
      const cached: AsyncQueryState<Result, Args>['future'] & { dependencies?: unknown[] } = FutureCache[cache]
      if (cached && shallowEqual(cached.dependencies, [_query, variables, cache, renderId, skip, mockMe])) {
        return cached
      }
    }
    if (
      fetchRef?.current &&
      shallowEqual(((fetchRef.current as unknown) as Result & { dependencies?: unknown[] }).dependencies, [
        _query,
        variables,
        cache,
        renderId,
        skip,
        mockMe,
      ])
    ) {
      return fetchRef.current
    }

    const fetch = async (variables: Args): Promise<Result> => {
      const genOrPromise = _query(variables)
      const generator =
        'next' in genOrPromise
          ? genOrPromise
          : mockMe
          ? (async function* () {
              yield await (new Promise(resolve => {
                setTimeout(() => resolve(genOrPromise), 1000)
              }) as Promise<Result>)
            })()
          : (async function* () {
              yield await (genOrPromise as Promise<Result>)
            })()

      const update = (stateUpdate: Partial<AsyncQueryState<Result, Args>>) =>
        new Promise<AsyncQueryState<Result, Args>>((resolve, reject) => {
          setState(({ error, ...state }) => {
            const nextState: AsyncQueryState<Result, Args> = {
              ...state,
              ...stateUpdate,
              future,
              loading: false,
              refetch: () => setRenderId(id => id + 1),
              fetchMore: _query,
            }
            resolve(nextState)
            return nextState
          })
        })

      try {
        let result
        for await (const data of generator) {
          // check for unmounting
          if (mount.current === -1) return result
          result = (await update({ data })).data
        }
        return result
      } catch (error) {
        return (await update({ error })).data
      }
    }

    const result: Promise<Result> & { dependencies?: unknown[] } = renderId && fetch(variables)
    result.dependencies = [_query, variables, cache, renderId, skip, mockMe]

    if (cache) {
      FutureCache[cache] = result
    }
    fetchRef.current = result

    return result
  }, [_query, variables, cache, renderId, skip, mockMe])

  const [state, setState] = React.useState(
    () =>
      ({
        loading: !skip,
        future,
        refetch: () => setRenderId(id => id + 1),
        fetchMore: _query,
      } as AsyncQueryState<Result, Args>),
  )

  React.useEffect(() => {
    mount.current = 1
    return () => {
      mount.current = -1
    }
  }, [])

  let result = state
  if (state.future !== future) {
    result = { ...state, loading: true, future }
  }

  return result
}
