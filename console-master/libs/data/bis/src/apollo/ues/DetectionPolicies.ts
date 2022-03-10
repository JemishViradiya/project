import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery, RiskLevel } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, Permission } from '@ues-data/shared'

import {
  CreateDetectionPolicyMutationMock,
  DefaultDetectionPolicyQueryMock,
  DeleteDetectionPoliciesMutationMock,
  DetectionPolicyQueryMock,
  UpdateDetectionPolicyMutationMock,
} from '../mocks/ues/DetectionPolicies.mock'

interface DetectionPolicyData {
  defaultPolicy?: boolean
  arr: {
    enabled: boolean
    minimumRiskLevel?: RiskLevel
  }
  deviceRiskDetection: {
    riskDetections: Array<{
      riskLevel: RiskLevel
      detections: Array<{
        name: string
      }>
    }>
  }
}

export interface DetectionPolicyInput {
  name: string
  description?: string
  policyData: DetectionPolicyData
}

export interface DetectionPolicyQueryResult {
  detectionPolicy: {
    description: string | null
    name: string
    id: string
    policyData: DetectionPolicyData
    updatedByUser: string
    updatedAt: number
  }
}

export interface DetectionPolicyQueryVariables {
  id: string
}

export const DetectionPolicyQuery: ApolloQuery<DetectionPolicyQueryResult, DetectionPolicyQueryVariables> = {
  displayName: 'DetectionPolicyQuery',
  query: gql`
    query policy($id: ID!) {
      detectionPolicy: BIS_detectionPolicy(id: $id) {
        id: policyId
        name
        description
        updatedByUser
        updatedAt
        policyData {
          defaultPolicy
          arr {
            enabled
            minimumRiskLevel
          }
          deviceRiskDetection {
            riskDetections {
              riskLevel
              detections {
                name
              }
            }
          }
        }
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  mockQueryFn: ({ id }) =>
    id === 'd5216e55-f9b4-4af8-915b-dbcf1671b16c' ? DefaultDetectionPolicyQueryMock : DetectionPolicyQueryMock,
  permissions: new Set([Permission.BIS_RISKPROFILE_READ]),
}

export interface CreateDetectionPolicyMutationResult {
  createDetectionPolicy: {
    name: string
    description: string | null
    id: string
  }
}

export interface CreateDetectionPolicyMutationVariables {
  input: DetectionPolicyInput
}

export const CreateDetectionPolicyMutation: ApolloMutation<
  CreateDetectionPolicyMutationResult,
  CreateDetectionPolicyMutationVariables
> = {
  mutation: gql`
    mutation createDetectionPolicy($input: DetectionPolicyInput!) {
      createDetectionPolicy: BIS_createDetectionPolicy(input: $input) {
        description
        name
        id: policyId
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  mockMutationFn: () => CreateDetectionPolicyMutationMock,
}

export interface UpdateDetectionPolicyMutationResult {
  updateDetectionPolicy: {
    description: string | null
    name: string
    id: string
  }
}

export interface UpdateDetectionPolicyMutationVariables {
  id: string
  input: DetectionPolicyInput
}

export const UpdateDetectionPolicyMutation: ApolloMutation<
  UpdateDetectionPolicyMutationResult,
  UpdateDetectionPolicyMutationVariables
> = {
  mutation: gql`
    mutation updateDetectionPolicy($id: ID!, $input: DetectionPolicyInput!) {
      updateDetectionPolicy: BIS_updateDetectionPolicy(id: $id, input: $input) {
        description
        name
        id: policyId
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  mockMutationFn: () => UpdateDetectionPolicyMutationMock,
}

export interface DeleteDetectionPoliciesMutationResult {
  deleteDetectionPolicies: {
    success: string[]
    fail: string[]
  }
}

export interface DeleteDetectionPoliciesMutationVariables {
  ids: string[]
}

export const DeleteDetectionPoliciesMutation: ApolloMutation<
  DeleteDetectionPoliciesMutationResult,
  DeleteDetectionPoliciesMutationVariables
> = {
  mutation: gql`
    mutation deleteDetectionPolicies($ids: [ID]!) {
      deleteDetectionPolicies: BIS_deleteDetectionPolicies(ids: $ids) {
        success
        fail
      }
    }
  `,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  mockMutationFn: () => DeleteDetectionPoliciesMutationMock,
}
