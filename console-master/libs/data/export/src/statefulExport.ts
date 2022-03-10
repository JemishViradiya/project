import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useApolloClient } from '@apollo/client'

import type {
  AbstractQuery,
  AbstractQueryOptions,
  ApolloQuery,
  ApolloQueryOptions,
  AsyncQuery,
  AsyncQueryOptions,
  ReduxQuery,
  ReduxQueryOptions,
  StatefulResult,
} from '@ues-data/shared'
import { UesReduxStore, useMock } from '@ues-data/shared'

import { browserStreamsWithPolyfill } from './lib'

type Selector<Result, StreamResult> = (r: Result) => StreamResult[]

async function exportFunction<Result, Args, TStream>(
  adapter: (variables: Args) => Promise<Result>,
  queryParam: AbstractQuery<unknown, Args, Result>,
  options: Partial<AbstractQueryOptions<Args>> & { selector: Selector<Result, TStream> },
  variables: Args = queryParam.defaultVariables,
): Promise<ReadableStream<TStream>> {
  const { selector } = options
  const { ReadableStream } = await browserStreamsWithPolyfill()

  const i = queryParam.iterator

  let result: Result
  let vars: Args
  return new ReadableStream({
    async pull(controller) {
      vars = vars ? i(vars, result) : variables

      if (vars === null) {
        return controller.close()
      }

      result = await adapter(vars)
      const items = selector(result)
      for (const item of items) {
        controller.enqueue(item)
      }
    },
  })
}

export function useExportAsyncQuery<Result, Args extends unknown>(
  query: AsyncQuery<Result, Args>,
  opts: Partial<AsyncQueryOptions<Result, Args>> = {},
): <TStream>(
  options: AsyncQueryOptions<Result, Args> & { selector: Selector<Result, TStream> },
) => Promise<ReadableStream<TStream>> {
  const mockMe = useMock(query)
  return useCallback(
    options =>
      exportFunction(
        (variables: Args) => {
          const q = mockMe ? query.mockQueryFn : query.query
          const result = q(variables)
          if ('next' in result) {
            throw Error('Not Implemented')
          }
          return Promise.resolve(result)
        },
        query as AbstractQuery<unknown, Args, Result>,
        Object.assign({}, opts, options),
        options.variables || opts.variables,
      ),
    [mockMe, query, opts],
  )
}

export function useExportApolloQuery<Result, Args extends unknown>(
  query: ApolloQuery<Result, Args>,
  opts: Partial<ApolloQueryOptions<Result, Args>> = {},
): <TStream>(
  options: ApolloQueryOptions<Result, Args> & { selector: Selector<Result, TStream> },
) => Promise<ReadableStream<TStream>> {
  const apollo = useApolloClient()
  const mockMe = useMock(query)
  return useCallback(
    options =>
      exportFunction(
        async (variables: Args) => {
          if (mockMe) return Promise.resolve(query.mockQueryFn(variables))
          const { data } = await apollo.query<Result>({
            ...query,
            ...options,
            fetchPolicy: options.exportFetchPolicy || 'no-cache',
            variables,
          })
          return data
        },
        query,
        Object.assign({}, opts, options),
        options.variables || opts.variables,
      ),
    [apollo, mockMe, query, opts],
  )
}

const thenOrNow = (sub: PromiseLike<unknown> | void, cb: () => unknown) => {
  if (sub && sub.then) {
    return sub.then(cb)
  }
  return cb()
}

export function useExportReduxQuery<Result, Args extends unknown, Selected = StatefulResult<Result>>(
  queryParam: ReduxQuery<Result, Args, Selected>,
  opts: Partial<ReduxQueryOptions<Args>> = {},
): <TStream>(options: ReduxQueryOptions<Args> & { selector: Selector<Result, TStream> }) => Promise<ReadableStream<TStream>> {
  const mockMe = useMock(queryParam)
  const dispatch = useDispatch()
  return useCallback(
    options =>
      exportFunction(
        (variables: Args) => {
          const { mockQuery, mockQueryFn, slice, selector } = queryParam
          const query = (mockMe && mockQuery) || queryParam.query
          if (mockMe) return Promise.resolve(mockQueryFn(variables))

          thenOrNow(slice && UesReduxStore.mountSlice(slice, true), () =>
            dispatch(typeof query === 'function' ? query(variables, { mock: mockMe }) : query),
          )
          return new Promise<Result>((resolve, reject) => {
            const unsubscribe = UesReduxStore.subscribe(() => {
              const result = selector(variables)(UesReduxStore.getState()) as StatefulResult<Result>
              if (!result.loading) {
                unsubscribe()
                if (result.error) {
                  reject(result.error)
                } else if (result['data']) {
                  resolve(result['data'])
                } else {
                  resolve(null)
                }
              }
            })
          })
        },
        queryParam,
        Object.assign({}, opts, options),
        options.variables || opts.variables,
      ),
    [queryParam, opts, mockMe, dispatch],
  )
}
