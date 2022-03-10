//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

// Placeholder for final API, can only be run as a mock atm.
const querySamlServicesGpl = gql`
  query SamlServices {
    samlservices @rest(type: "EidAuthenticators", path: "/v1/Services", method: "GET")
  }
`

interface SamlServices {
  name: string
}

const querySamlServicesMock: SamlServices[] = [
  {
    name: 'SAML Service 1',
  },
]

export const queryEidSamlServices: ApolloQuery<SamlServices[], unknown> = {
  mockQueryFn: () => querySamlServicesMock,
  query: querySamlServicesGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.EID_API),
  permissions: NoPermissions,
}
