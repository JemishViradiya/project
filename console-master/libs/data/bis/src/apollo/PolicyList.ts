import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloDataUtils, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import {
  PolicyListAddMutationMock,
  PolicyListDeleteMutationMock,
  PolicyListDetailsQueryMock,
  PolicyListQueryMock,
  PolicyListUpdateMutationMock,
} from './mocks'

const listSelection = `
  appliedGroups
  appliedUsers
  description
  name
  id: policyId
`

const actionsSelection = `
  actionType
  pillarTypeId
  actionAttributes {
    entityId
    groupGuid
    groupName
    userEcoIds
    userGuids
    actionId
    command
    profileGuid
    profileName
    gracePeriod
    timeout
    title
    message
  }
`

export const PolicyListQuery = {
  displayName: 'PolicyListQuery',
  query: gql`
    query policies {
      policies: BIS_policies {
        ${listSelection}
      }
    }
  `,
  mockQueryFn: () => PolicyListQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const PolicyListAddMutation = {
  displayName: 'PolicyListAddMutation',
  mutation: gql`
    mutation createPolicy($input: PolicyInput!) {
      createPolicy: BIS_createPolicy(input: $input) {
        ${listSelection}
      }
    }
  `,
  update: (cache, { data: { createPolicy } }) => {
    const { policies = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: PolicyListQuery.query })
    // Create a new policies list to trigger update.
    const p = policies.slice(0)
    p.push(createPolicy)
    cache.writeQuery({
      query: PolicyListQuery.query,
      data: { policies: p },
    })
  },
  mockMutationFn: () => PolicyListAddMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const PolicyListUpdateMutation = {
  displayName: 'PolicyListUpdateMutation',
  mutation: gql`
    mutation updatePolicy($id: ID!, $input: PolicyInput!) {
      updatePolicy: BIS_updatePolicy(id: $id, input: $input) {
        ${listSelection}
      }
    }
  `,
  update: (cache, { data: { updatePolicy } }) => {
    const { appliedUsers, appliedGroups, ...rest } = updatePolicy
    const { policies = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: PolicyListQuery.query })
    const updatedPolicies = []
    policies.forEach(policy => {
      if (policy.id === updatePolicy.id) {
        updatedPolicies.push({ ...policy, ...rest })
      } else {
        updatedPolicies.push(policy)
      }
    })
    cache.writeQuery({
      query: PolicyListQuery.query,
      data: { policies: updatedPolicies },
    })
  },
  mockMutationFn: () => PolicyListUpdateMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const PolicyListDeleteMutation = {
  displayName: 'PolicyListDeleteMutation',
  mutation: gql`
    mutation deletePolicies($ids: [ID]!) {
      deletePolicies: BIS_deletePolicies(ids: $ids) {
        success
        fail
      }
    }
  `,
  update: (cache, { data: { deletePolicies } }) => {
    const { policies = [] } = ApolloDataUtils.getApolloCachedValue(cache, { query: PolicyListQuery.query })
    const p = policies.slice(0)
    if (deletePolicies.success) {
      deletePolicies.success.forEach(id => {
        const index = p.findIndex(policy => policy.id === id)
        if (index !== -1) {
          p.splice(index, 1)
        }
      })
    }
    cache.writeQuery({
      query: PolicyListQuery.query,
      data: { policies: p },
    })
  },
  mockMutationFn: () => PolicyListDeleteMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}

export const PolicyListDetailsQuery: ApolloQuery<typeof PolicyListDetailsQueryMock, { id: string }> = {
  displayName: 'PolicyListDetailsQuery',
  query: gql`
    query policy($id: ID!) {
      policy: BIS_policy(id: $id) {
        ${listSelection}
        updatedByUser
        updatedAt
        policyData {
          identityPolicy {
            riskFactors
            riskLevelActions {
              level
              actions {${actionsSelection}}
            }
            fixUp {
              enabled
              minimumBehavioralRiskLevel
              actionPauseDuration
            }
            ipAddressPolicy {
              ipAddressListIds
              allBlackLists
              allWhiteLists
            }
          }
          geozonePolicy {
            riskFactors
            defaultRiskLevelActions {
              level
              actions {${actionsSelection}}
            }
            overriddenRiskLevelActions {
              geozoneId
              level
              actions {${actionsSelection}}
            }
            defaultActions {${actionsSelection}}
          }
        }
      }
    }
  `,
  mockQueryFn: () => PolicyListDetailsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}
