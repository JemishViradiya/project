import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { IpAddressSettingsQueryMock } from './mocks'

export const IpAddressSettingsQuery: ApolloQuery<
  typeof IpAddressSettingsQueryMock,
  {
    isBlacklist: boolean
    offset: number
    limit: number
    sortBy: string
    sortDirection: string
    searchText: string
  }
> = {
  displayName: 'IpAddressSettingsQuery',
  query: gql`
    query ipAddressSettings(
      $isBlacklist: Boolean
      $offset: Int
      $limit: Int
      $sortBy: String
      $sortDirection: String
      $searchText: String
    ) {
      ipAddressSettings: BIS_ipAddressSettings(
        isBlacklist: $isBlacklist
        offset: $offset
        limit: $limit
        sortBy: $sortBy
        sortDirection: $sortDirection
        searchText: $searchText
      ) {
        id: ipAddressListId
        name
        ipAddresses
        isBlacklist
        listType
        vendorUrl
      }
    }
  `,
  mockQueryFn: () => IpAddressSettingsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
