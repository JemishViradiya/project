import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery, ApolloSubscription } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloAction, getApolloQueryContext, Permission, ServiceId } from '@ues-data/shared'

import { PolicySchema } from '../../model'
import {
  BISIsACLQueryMock,
  BISMigrateToDetectionPoliciesMutationMock,
  BISPolicySchemaQueryMock,
} from '../mocks/ues/PolicySchema.mock'

export interface PolicySchemaResponse {
  policySchema: PolicySchema
}

export interface IsACLResponse {
  isACL: boolean
}

interface MigrateToDPAndACLResponse {
  migrateToDPAndACL: {
    dp: boolean
    acl: boolean
  }
}

export const BISPolicySchemaQuery: ApolloQuery<PolicySchemaResponse, void> = {
  id: 'bis.policySchema',
  displayName: 'BISPolicySchemaQuery',
  query: gql`
    query policySchema {
      policySchema: BIS_policySchema
    }
  `,
  mockQueryFn: () => BISPolicySchemaQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_SETTINGS_READ]),
  actions: new Set([ApolloAction.SKIP_WHEN_PERMISSIONS_NOT_MET]),
}

export const BISIsACLQuery: ApolloQuery<IsACLResponse, void> = {
  id: 'bis.isACL',
  displayName: 'BISIsACLQuery',
  query: gql`
    query isACL {
      isACL: BIS_isACL
    }
  `,
  mockQueryFn: () => BISIsACLQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIG_TENANT_READ]),
  services: new Set([ServiceId.BIG]),
  actions: new Set([ApolloAction.SKIP_WHEN_PERMISSIONS_NOT_MET, ApolloAction.SKIP_WHEN_SERVICE_NOT_ENABLED]),
}

// Not used right now but we can start using it once we have websocket implementation available
const BISPolicySchemaSubscription: ApolloSubscription<PolicySchemaResponse, PolicySchemaResponse, void> = {
  ...BISPolicySchemaQuery,
  subscription: gql`
    subscription onPolicySchemaChanged {
      policySchemaChanged: BIS_policySchemaChanged
    }
  `,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev
    return {
      policySchema: subscriptionData.data.policySchema,
    }
  },
}

export const BISMigrateToDPAndACLMutation: ApolloMutation<MigrateToDPAndACLResponse, void> = {
  mutation: gql`
    mutation migrateToDPAndACL {
      migrateToDPAndACL: BIS_migrateToDPAndACL {
        dp
        acl
      }
    }
  `,
  update: (cache, { data }) => {
    if (data?.migrateToDPAndACL?.acl) {
      cache.writeQuery({
        query: BISIsACLQuery.query,
        data: {
          isACL: true,
        },
      })
    }
    if (data?.migrateToDPAndACL?.dp) {
      cache.writeQuery({
        query: BISPolicySchemaQuery.query,
        data: {
          policySchema: PolicySchema.DetectionPolicy,
        },
      })
    }
  },
  mockMutationFn: () => BISMigrateToDetectionPoliciesMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: new Set([Permission.BIS_SETTINGS_UPDATE, Permission.BIG_TENANT_UPDATE]),
}
