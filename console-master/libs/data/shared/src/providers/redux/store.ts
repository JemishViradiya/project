import type { Action, AnyAction, PreloadedState, Reducer, Store } from 'redux'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import type { ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import thunkMiddleware from 'redux-thunk'

import type { SliceDependencyInjectionStore } from './sliceDependencyInjectorEnhancer'
import { sliceDependencyInjectionEnhancer } from './sliceDependencyInjectorEnhancer'

interface ThunkStore<S = unknown, A extends AnyAction = AnyAction> {
  dispatch: ThunkDispatch<S, undefined, A>
}

// const loggerMiddleware = ({ getState }) => next => action => {
//   try {
//     const returnedValue = next(action)
//     console.log(action, getState())
//     return returnedValue
//   } catch (e) {
//     console.error(action, e)
//     throw e
//   }
// }

export function configureStore<S, A extends Action>(
  preloadedState: PreloadedState<S> = {} as PreloadedState<S>,
): Store<S, A> & SliceDependencyInjectionStore & ThunkStore<S, A> {
  const sagaMiddleware = createSagaMiddleware()
  const middlewareEnhancer = applyMiddleware(thunkMiddleware as ThunkMiddleware<S, A>, sagaMiddleware)

  const devtoolsCompose = process.env.NODE_ENV === 'development' && window && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
  const composeEnhancers: typeof compose = devtoolsCompose || compose

  const store = createStore(
    (state => state ?? ({} as S)) as Reducer<S, A>,
    preloadedState,
    composeEnhancers(sliceDependencyInjectionEnhancer(sagaMiddleware), middlewareEnhancer),
  )

  if (process.env.NODE_ENV !== 'test') {
    console.log('[Redux] store created', devtoolsCompose ? '(with devtools)' : '')
  }
  return store
}
