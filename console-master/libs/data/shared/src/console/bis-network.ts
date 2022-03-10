import type { OperationDefinitionNode } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import { ApolloLink, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { resolveAbsoluteApiUrl } from '@ues-data/network'

import { NetworkServices } from '../network'
import { TRANSPORT_TYPE } from '../providers/apollo/common'
import { UesSessionApi } from './index'

let hasWebSockets = true // By default, we hope to have websockets.

const createWsLink = destination => {
  const destinationUrl = NetworkServices[destination]
  const apiUrl = resolveAbsoluteApiUrl(destinationUrl, 'wss')
  const wsClient = new SubscriptionClient(apiUrl, {
    lazy: true,
    minTimeout: 10000,
    reconnect: true,
    connectionParams: () => ({
      Authorization: `Bearer ${UesSessionApi.getToken()}`,
      tenant: UesSessionApi.getTenantId(),
    }),
  })

  const wsLink = new WebSocketLink(wsClient)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { subscriptionClient } = wsLink

  // Note SubscriptionClient onError returns an 'off' function here.
  const fallbackErrorOff = subscriptionClient.onError(error => {
    // Ensure that we don't reconnect anymore
    subscriptionClient.reconnect = false
    // Disable websocket usage
    hasWebSockets = false
  })
  const onConnectedOff = subscriptionClient.onConnected(() => {
    fallbackErrorOff()
    onConnectedOff()
  })

  return wsLink
}

const splitLink = (wsLink, destination) =>
  split(
    ({ query, getContext }) => {
      if (getContext().transport === TRANSPORT_TYPE.WEB_SOCKET && hasWebSockets) {
        return true
      }
      const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    new HttpLink({
      uri: NetworkServices[destination],
      fetch: (uri, options) => {
        Object.assign(options.headers, {
          tenant: UesSessionApi.getTenantId(),
        })
        return fetch(uri, options)
      },
    }),
  )

export const BISApolloLink = destination => ApolloLink.from([splitLink(createWsLink(destination), destination)])
