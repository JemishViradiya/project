import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloDataUtils, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { AppliedListAddMutationMock, AppliedListDeleteMutationMock, AppliedListQueryMock } from './mocks'

export const AppliedListQuery: ApolloQuery<typeof AppliedListQueryMock, { policyId: string }> = {
  displayName: 'AppliedListQuery',
  query: gql`
    query appliedUsersAndGroups($policyId: ID!) {
      applied: BIS_appliedUsersAndGroups(policyId: $policyId) {
        users {
          id
          info {
            displayName
            primaryEmail
          }
          __typename
        }
        groups {
          id
          info {
            name
            description
          }
          __typename
        }
      }
    }
  `,
  mockQueryFn: () => AppliedListQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const AppliedListAddMutation = {
  displayName: 'AppliedListAddMutation',
  mutation: gql`
    mutation addUsersAndGroups($policyId: ID!, $userIds: [ID]!, $groupIds: [ID]!) {
      addUsersAndGroups: BIS_addUsersAndGroups(policyId: $policyId, userIds: $userIds, groupIds: $groupIds) {
        success
        fail
        policyId
      }
    }
  `,
  mockMutationFn: () => AppliedListAddMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const AppliedListDeleteMutation = {
  displayName: 'AppliedListDeleteMutation',
  mutation: gql`
    mutation deleteUsersAndGroups($policyId: ID!, $userIds: [ID]!, $groupIds: [ID]!) {
      deleteUsersAndGroups: BIS_deleteUsersAndGroups(policyId: $policyId, userIds: $userIds, groupIds: $groupIds) {
        success
        fail
        policyId
      }
    }
  `,
  update: (cache, { data: { deleteUsersAndGroups } }) => {
    const { applied: { users = [], groups = [] } = {} } = ApolloDataUtils.getApolloCachedValue(cache, {
      query: AppliedListQuery.query,
      variables: {
        policyId: deleteUsersAndGroups.policyId,
      },
    })
    if (deleteUsersAndGroups.success) {
      const filteredUsers = users.filter(userId => !deleteUsersAndGroups.success.includes(userId))
      const filteredGroups = groups.filter(groupId => !deleteUsersAndGroups.success.includes(groupId))
      cache.writeQuery({
        query: AppliedListQuery.query,
        variables: { policyId: deleteUsersAndGroups.policyId },
        data: { applied: { users: filteredUsers, groups: filteredGroups } },
      })
    }
  },
  mockMutationFn: () => AppliedListDeleteMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
