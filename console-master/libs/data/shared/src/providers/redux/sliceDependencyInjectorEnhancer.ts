import { omit } from 'lodash-es'
import type { Reducer, ReducersMapObject, StoreEnhancer } from 'redux'
import { combineReducers } from 'redux'
import type { Saga, SagaMiddleware, Task } from 'redux-saga'

import type { UesReduxSlices } from './slices'

type SliceDependencyResult<S extends Saga> = {
  reducer: Reducer
  saga?: S
  sagaParameters?: Parameters<S>
}

type CacheState = {
  [k in UesReduxSlices]?: {
    factory: () => Promise<SliceDependencyResult<Saga>>
    pending?: Promise<SliceDependencyResult<Saga>>
    slice?: SliceDependencyResult<Saga>
    task?: Task
  }
} & {
  reducers?: ReducersMapObject
}

export interface SliceDependencyInjectionStore {
  registerSlice<S extends Saga = Saga>(
    id: UesReduxSlices,
    factory: (() => Promise<SliceDependencyResult<S>>) | SliceDependencyResult<S>,
    opts?: { eager?: boolean },
  ): UesReduxSlices
  mountSlice(id: UesReduxSlices, once?: true): Promise<unknown> | void
  unmountSlice(id: UesReduxSlices): void
}

// TODO: Weak?
const moduleCache: Record<symbol, CacheState> = {}

class SliceNotFoundError extends Error {}

export const sliceDependencyInjectionEnhancer: (
  sagaMiddleware: SagaMiddleware,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => StoreEnhancer<SliceDependencyInjectionStore> = sagaMiddleware => nextCreator => (
  // hello
  originalReducer,
  // there
  preloadedState,
) => {
  const iid = Symbol('sliceDependencyInjectionEnhancer')
  const thisModuleCache = moduleCache as Record<typeof iid, CacheState>
  thisModuleCache[iid] = { reducers: { _: () => true } }

  const cancelTask = (id: UesReduxSlices) => {
    const sliceState = (thisModuleCache[iid] as CacheState)[id]
    if (!sliceState) return

    const { task } = sliceState
    if (task) {
      if (process.env.NODE_ENV !== 'test') console.log('[Redux] removing saga:', id)
      if (task.isRunning() && !task.isCancelled()) {
        task.cancel()
      }
      delete sliceState.task
    }
  }
  const replaceSlice = (
    self: typeof sliceApi,
    id: UesReduxSlices,
    { reducer, saga, sagaParameters = [] }: SliceDependencyResult<Saga>,
  ) => {
    if (process.env.NODE_ENV !== 'test') console.log(`[Redux] adding state slice${saga ? ' with saga' : ''}:`, id)
    if (saga) {
      cancelTask(id)
    }

    const cache = thisModuleCache[iid] as CacheState

    self.replaceReducer(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      combineReducers((cache.reducers = { ...cache.reducers, [id]: reducer })),
    )

    if (saga) {
      if (process.env.NODE_ENV !== 'test') console.log('[Redux] adding saga:', id)
      const task = sagaMiddleware.run(saga, ...sagaParameters)
      const cacheEntry = cache[id]
      if (cacheEntry) cacheEntry.task = task
    }
  }

  const nextStore = nextCreator(originalReducer, preloadedState)

  const sliceApi: typeof nextStore & SliceDependencyInjectionStore = {
    ...nextStore,
    registerSlice(
      id: UesReduxSlices,
      factory: (() => Promise<SliceDependencyResult<Saga>>) | SliceDependencyResult<Saga>,
      { eager } = {},
    ) {
      const cache: CacheState = thisModuleCache[iid]
      const previousSlice = cache[id]
      if (factory && 'call' in factory) {
        cache[id] = ({ factory } as unknown) as CacheState[UesReduxSlices]
      } else {
        cache[id] = ({ slice: factory } as unknown) as CacheState[UesReduxSlices]
        if (eager === undefined) {
          eager = true
        }
      }
      if ((previousSlice && cache.reducers && cache.reducers[id]) || eager) {
        sliceApi.mountSlice(id)
      }
      return id
    },
    mountSlice(id: UesReduxSlices, once?: boolean) {
      const cacheEntry = thisModuleCache[iid] as CacheState
      const sliceState = cacheEntry[id]
      if (!sliceState) {
        throw new SliceNotFoundError(id)
      }
      if (sliceState.slice) {
        if (!once || (cacheEntry.reducers && sliceState.slice.reducer !== cacheEntry.reducers[id])) {
          replaceSlice(sliceApi, id, sliceState.slice)
        }
      } else if (sliceState.pending) {
        return sliceState.pending
      } else {
        sliceState.pending = sliceState.factory().then(slice => {
          sliceState.slice = slice
          if (thisModuleCache[iid][id] === sliceState) {
            replaceSlice(sliceApi, id, slice)
          }
          return slice
        })
        return sliceState.pending
      }
    },
    unmountSlice(id: UesReduxSlices) {
      if (process.env.NODE_ENV !== 'test') console.log('[Redux] removing reducer:', id)
      const cache = thisModuleCache[iid] as CacheState
      this.replaceReducer(combineReducers((cache.reducers = omit(cache.reducers, id))))

      cancelTask(id)
    },
  }
  return sliceApi
}

// eslint-disable-next-line sonarjs/no-collapsible-if
if (process.env.NODE_ENV !== 'production') {
  // TODO: support import.meta.hot / import.meta.webpackHot
  if (typeof module !== undefined && module.hot) {
    Object.assign(moduleCache, module.hot.data)
    module.hot.accept(error => {
      console.error('Unable to hot-reload:', error)
    })
    module.hot.dispose(data => {
      Object.assign(data, moduleCache)
    })
  }
}
