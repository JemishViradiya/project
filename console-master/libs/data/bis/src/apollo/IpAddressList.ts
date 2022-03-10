import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import {
  IpAddressListAddMutationMock,
  IpAddressListDeleteMutationMock,
  IpAddressListQueryMock,
  IpAddressListUpdateMutationMock,
} from './mocks'

export const IpAddressListQuery: ApolloQuery<typeof IpAddressListQueryMock, { id: string }> = {
  displayName: 'IpAddressListQuery',
  query: gql`
    query getIpAddressList($id: ID!) {
      getIpAddressList: BIS_getIpAddressList(id: $id) {
        ipAddressListId
        name
        ipAddresses
        isBlacklist
        listType
        vendorUrl
      }
    }
  `,
  mockQueryFn: () => IpAddressListQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const IpAddressListAddMutation = {
  displayName: 'IpAddressListAddMutation',
  mutation: gql`
    mutation addIpAddressList($input: IpAddressListInput!) {
      addIpAddressList: BIS_addIpAddressList(input: $input) {
        name
        listType
        vendorUrl
        ipAddresses
        isBlacklist
      }
    }
  `,
  mockMutationFn: () => IpAddressListAddMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const IpAddressListUpdateMutation = {
  displayName: 'IpAddressListUpdateMutation',
  mutation: gql`
    mutation updateIpAddressList($id: ID!, $input: IpAddressListInput!) {
      updateIpAddressList: BIS_updateIpAddressList(id: $id, input: $input)
    }
  `,
  update: (cache, { data: { updateIpAddressList } }) => {
    // ipAddressService doesn't return updated result (PUT method) so let's just remove the item from cache
    // so it would be refetched next time
    cache.evict({ fieldName: 'BIS_getIpAddressList', args: { id: updateIpAddressList } })
  },
  mockMutationFn: () => IpAddressListUpdateMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const IpAddressListDeleteMutation = {
  displayName: 'IpAddressListDeleteMutation',
  mutation: gql`
    mutation deleteIPAddresses($ids: [ID]!) {
      deleteIpAddresses: BIS_deleteIpAddresses(ids: $ids) {
        success
        fail
      }
    }
  `,
  mockMutationFn: () => IpAddressListDeleteMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
