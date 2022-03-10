import { gql } from '@apollo/client'

import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { ClientParamsQueryMock } from './mocks'

const selection = `
  maps {
    apiKey
    apiVersion
  }
  features {
    key
    value
    type
  }
  support {
    helpUrl
  }
  privacyMode {
    mode
    maxZoom
    maxPrecision
    audit {
      userName
      datetime
    }
  }
  capabilities
  tenantType
`

export const ClientParamsQuery = (mockedApiKey?: string) => ({
  displayName: 'ClientParamsQuery',
  query: gql`
    query clientParams {
      clientParams: BIS_clientParams {
        ${selection}
      }
    }
  `,
  subscription: gql`
    subscription onClientParamsChanged {
      clientParamsChanged: BIS_clientParamsChanged {
        ${selection}
      }
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      ...prev,
      clientParams: subscriptionData.data.clientParamsChanged,
    }
  },
  mockQueryFn: () => ClientParamsQueryMock(mockedApiKey),
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
})
