import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { AddressLookupByEventIdQueryMock, AddressLookupQueryMock } from './mocks'

export const AddressLookupQuery: ApolloQuery<typeof AddressLookupQueryMock, { lat: number; lon: number }> = {
  displayName: 'AddressLookupQuery',
  query: gql`
    query geocode($lat: Float!, $lon: Float!) {
      geocode: BIS_geocode(lat: $lat, lon: $lon)
    }
  `,
  mockQueryFn: () => AddressLookupQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const AddressLookupByEventIdQuery: ApolloQuery<typeof AddressLookupByEventIdQueryMock, { id: string }> = {
  displayName: 'AddressLookupByEventIdQuery',
  query: gql`
    query eventLocation($id: ID!) {
      eventLocation: BIS_eventLocation(id: $id)
    }
  `,
  mockQueryFn: () => AddressLookupByEventIdQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
