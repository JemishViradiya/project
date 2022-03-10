import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './redux/rootReducer'
import rootSaga from './redux/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancer(applyMiddleware(sagaMiddleware)))

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export { store, persistor }
