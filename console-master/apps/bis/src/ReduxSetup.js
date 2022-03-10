import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

import auth from './auth/state'

const reducers = { auth }
const reducerKeys = Object.keys(reducers)

const rootReducer = (state = {}, action) => {
  const nextState = {}
  for (const key of reducerKeys) {
    nextState[key] = reducers[key](state[key], action)
  }
  return nextState
}

const composer =
  process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldCatchErrors: false,
      })
    : compose

const configureStore = preloadedState => {
  const store = createStore(rootReducer, preloadedState, composer(applyMiddleware(thunk)))

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./auth/state', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

export const store = configureStore({})

export const observeStore = (store, select, onChange, triggerType = 'level') => {
  let currentState

  function handleChange() {
    const nextState = select(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }

  const unsubscribe = store.subscribe(handleChange)
  if (triggerType === 'edge') {
    currentState = select(store.getState())
  } else {
    setImmediate(handleChange)
  }
  return unsubscribe
}
