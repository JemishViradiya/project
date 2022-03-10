import { SubscriptionClient } from 'subscriptions-transport-ws'

import { ApolloClient, ApolloLink, HttpLink, split } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { f11n } from '@ues-bis/standalone-shared'

import { ExpireAuthentication, getAccessToken, getTenant } from './auth/state'
import { createCache } from './common/apollo'
import LocalState from './localState'
import { observeStore, store } from './ReduxSetup'
import { report } from './Reporter'

const apiPort = window.location.port

let queryTransport = localStorage.getItem('graphqlTransport') || 'ws'

const connectionParams = () => {
  const state = store.getState()
  const accessToken = getAccessToken(state)
  if (!accessToken) {
    throw new Error('NoValidAuthToken')
  }
  const tenant = getTenant(state)
  return { Authorization: `Bearer ${accessToken}`, tenant, features: f11n.transport.json() }
}

const portOrEmpty = apiPort ? `:${apiPort}` : ''
const wsClient = new SubscriptionClient(`wss://${window.location.hostname}${portOrEmpty}/graphql`, {
  // Fixed to be lazy mode due to unmerged fix: https://github.com/apollographql/subscriptions-transport-ws/pull/675
  // for the issue: https://github.com/apollographql/subscriptions-transport-ws/issues/295
  lazy: true,
  reconnect: true,
  connectionParams,
  connectionCallback: error => {
    if (error) {
      store.dispatch(ExpireAuthentication({ error }))
    }
  },
})
// Modify generator's minimum timeout value due to the open issue https://github.com/apollographql/subscriptions-transport-ws/issues/377
const { maxConnectTimeGenerator: { setMin } = {} } = wsClient
if (typeof setMin === 'function') {
  // Increase generator's minimum WS setup timeout to be 10 seconds intead of 1 second
  wsClient.maxConnectTimeGenerator.setMin(10000)
}
const wsLink = new WebSocketLink(wsClient)

// By default, we hope to have websockets.
let hasWebSockets = true
// Note SubscriptionClient onError returns an 'off' function here.
const fallbackErrorOff = wsLink.subscriptionClient.onError(error => {
  console.log('WebSocket Error: ', error)
  console.log('Switching to HTTP only')
  // Ensure that we don't reconnect anymore
  wsLink.subscriptionClient.reconnect = false
  // Disable websocket usage
  queryTransport = 'http'
  hasWebSockets = false
  report({ message: 'Websocket unavailable' })
})
const onConnectedOff = wsLink.subscriptionClient.onConnected(() => {
  fallbackErrorOff()
  onConnectedOff()
})

const fetchWithAuthorization = (uri, options) => {
  const state = store.getState()
  const accessToken = getAccessToken(state)
  const tenant = getTenant(state)
  if (!accessToken) {
    throw new Error('NoValidAuthToken')
  }
  options.headers.Authorization = `Bearer ${accessToken}`
  options.headers.tenant = tenant
  Object.assign(options.headers, f11n.transport.headers())
  return fetch(uri, options)
}

const splitLink = wsLink =>
  split(
    ({ query }) => {
      if (!hasWebSockets) {
        return false
      }
      if (queryTransport === 'http') {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      }
      return true
    },
    wsLink,
    new HttpLink({
      uri: `https://${window.location.hostname}:${apiPort}/graphql`,
      credentials: 'same-origin',
      fetch: fetchWithAuthorization,
    }),
  )

const cache = createCache()

const resolvers = {
  Mutation: {
    ...LocalState.getMutations(),
  },
}

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        for (const { message, locations, path, extensions: { code, exception } = {} } of graphQLErrors) {
          const codeFragment = code ? ` Code: ${code}` : ''
          console.log(`[GraphQL error]:${codeFragment} Message: ${message}, Location: ${locations}, Path: ${path}`)
          if (exception && exception.stacktrace) {
            console.log(exception.stacktrace.join('\n'))
          }
          if (code === 'UNAUTHENTICATED') {
            store.dispatch(ExpireAuthentication({ error: { message, code, name: 'AuthorizationError' } }))
          }
        }
      } else if (networkError) {
        console.log(`[Network error]: ${networkError}`)
      }
    }),
    splitLink(wsLink),
  ]),
  cache,
  resolvers,
})

LocalState.initialize(cache)

observeStore(
  store,
  ({ auth }) => {
    const { isAuthenticated } = auth
    if (isAuthenticated) {
      return getAccessToken(store.getState())
    }
  },
  async token => {
    // when we receive a change of token event, close the socket
    // and stop listening...
    const { subscriptionClient } = wsLink
    console.warn('tokenChange', !!token)
    if (token) {
      const status = client.status
      if (status !== WebSocket.CLOSED) {
        if (subscriptionClient.client) {
          subscriptionClient.client.close()
        }
      } else {
        subscriptionClient.client.emit('close', new CustomEvent('close'))
      }
      setImmediate(() => subscriptionClient.tryReconnect())
    } else if (subscriptionClient.client) {
      subscriptionClient.client.close()
    }
  },
  'edge',
)

export default client
