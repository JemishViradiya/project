import { RestLink } from 'apollo-link-rest'
import type { OperationDefinitionNode } from 'graphql'

import type { Operation } from '@apollo/client'
import { ApolloClient, ApolloLink, from, HttpLink, Observable } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api'

import { UesSessionApi } from '../../console'
import { BISApolloLink } from '../../console/bis-network'
import { VenueSessionApi } from '../../console/venue/session'
import { NetworkServices } from '../../network'
import { cloneWithoutTypename, definitionIsMutation } from '../../utils/apollo'
import { customizedCache } from './cache'
import { APOLLO_DESTINATION, TRANSPORT_TYPE } from './common'
import useApolloTransport from './hooks/useApolloTransport'

export * from './common'
export * from './useApolloIdbPrecache'

const traceMiddleware = new ApolloLink((operation, forward) => {
  const { kind, operation: operationType } = getMainDefinition(operation.query) as OperationDefinitionNode
  if (kind === 'OperationDefinition' && operationType === 'subscription') {
    return forward(operation)
  } else {
    const tracer = trace.getTracer('app-gql')
    const span = tracer.startActiveSpan(operation.operationName, sp => {
      sp.addEvent('start query', operation.variables)
      operation.setContext(({ headers = {} }) => {
        propagation.inject(context.active(), headers)
        return { headers }
      })

      return sp
    })

    return forward(operation).map(response => {
      span.addEvent('response received')
      if (response.errors) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: response.errors.toString() })
      } else {
        span.setStatus({ code: SpanStatusCode.OK })
      }
      span.end()
      return response
    })
  }
})

/* 
  This is a workaround to fix FetchInstrumentation and RestLink interaction.
  RestLink instantiates init parameter as plain object which causes FetchInstrumentation
  to use wrong header population logic. Request instance is explicitly created to
  pass FetchInstrumentation typecheck and fix headers population.
*/
const customFetch = (req, init) => {
  return fetch(new Request(encodeURI(req), init))
}
const RestLinkFactory = (opts: RestLink.Options): RestLink => new RestLink({ ...opts, customFetch })

const Routes = {
  [APOLLO_DESTINATION.BIG_REPORTING_SERVICE]: ApolloLink.from([
    new ApolloLink((operation, forward) => {
      operation.setContext(() => ({
        uri: `${NetworkServices[APOLLO_DESTINATION.BIG_REPORTING_SERVICE]}/${UesSessionApi.getTenantId()}`,
      }))
      return forward(operation)
    }),
    new HttpLink({
      uri: NetworkServices[APOLLO_DESTINATION.BIG_REPORTING_SERVICE],
    }),
  ]),
  [APOLLO_DESTINATION.BIS_PORTAL_SERVICE]: BISApolloLink(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  [APOLLO_DESTINATION.THREAT_EVENTS_BFF]: new HttpLink({
    uri: NetworkServices[APOLLO_DESTINATION.THREAT_EVENTS_BFF],
  }),
  [APOLLO_DESTINATION.PLATFORM_BFF]: new HttpLink({
    uri: NetworkServices[APOLLO_DESTINATION.PLATFORM_BFF],
  }),
  [APOLLO_DESTINATION.DASHBOARD_BFF]: new HttpLink({
    uri: NetworkServices[APOLLO_DESTINATION.DASHBOARD_BFF],
  }),
  [APOLLO_DESTINATION.REST_API]: RestLinkFactory({
    uri: NetworkServices[APOLLO_DESTINATION.REST_API],
  }),
  [APOLLO_DESTINATION.EID_API]: RestLinkFactory({
    uri: NetworkServices[APOLLO_DESTINATION.EID_API],
    credentials: 'include',
  }),
  [APOLLO_DESTINATION.VENUE_API]: new RestLink({
    uri: NetworkServices[APOLLO_DESTINATION.VENUE_API],
    customFetch: async (req, init) => {
      if (init.method === 'GET') {
        init.method = 'POST'
      }
      const headers: Headers = init.headers as Headers
      headers.delete('authorization')
      headers.delete('tenant-id')
      headers.delete('user-id')
      // UesSessionApi.getSession().data?.verificationToken
      headers.append('X-Request-Verification-Token', await VenueSessionApi.awaitVerificationToken())
      return fetch(new Request(req, init)) // See customFetch() for details on new Request() use
    },
    responseTransformer: async (response, typename) =>
      response.json().then(data => {
        if (typename === 'ThreatEvents') {
          for (const item of data) {
            item.ThreatId = item.ThreatId.toString()
            item.ThreatEventsDate = parseInt(item.ThreatEventsDate.slice(6, -2), 10)
          }
        }
        if (typeof data === 'number') {
          return { value: data }
        }
        return data
      }),
  }),
}

export function getApolloQueryContext(context: APOLLO_DESTINATION): { destination: string } {
  return { destination: context }
}

const cleanMutationTypenames = (operation: Operation) => {
  if (operation.query.definitions.some(definitionIsMutation) && operation.variables) {
    operation.variables = cloneWithoutTypename(operation.variables)
  }
}

const RoutingLink = new ApolloLink((operation, forward) => {
  const { destination } = operation.getContext()
  if (!destination) {
    throw new Error(`context.destination is required in operation: ${operation.operationName}`)
  }
  const link = Routes[destination]
  if (!link) {
    throw new Error(`context.destination ${destination} is not valid in operation: ${operation.operationName}`)
  }
  if (destination === APOLLO_DESTINATION.BIS_PORTAL_SERVICE) {
    cleanMutationTypenames(operation)
  }
  return link.request(operation, forward) || Observable.of()
})

const stateMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({ transport: useApolloTransport() || TRANSPORT_TYPE.HTTP })
  return forward(operation)
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${UesSessionApi.getToken()}`,
    },
  }))

  return forward(operation)
})

export const UesApolloClient = new ApolloClient({
  cache: customizedCache,
  link: from([stateMiddleware, authMiddleware, traceMiddleware, RoutingLink]),
})
