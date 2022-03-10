//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { UserUpdatePermissions } from '../shared/permissions'

export interface AssignmentPayload {
  userIds?: string[]
  groupIds?: string[]
}

export interface RecoEntityVariables {
  serviceId: string
  entityType: string
  entityId: string
}

export interface RecoAssignVariables extends RecoEntityVariables {
  payload: AssignmentPayload
}

const userGroupAssignGpl = gql`
  mutation Assign($serviceId: String!, $entityType: String!, $entityId: String!, $payload: AssignmentPayload!) {
    assign(serviceId: $serviceId, entityType: $entityType, entityId: $entityId, payload: $payload)
      @rest(
        path: "/platform/v1/reconciliation/assignments/services/{args.serviceId}/types/{args.entityType}/instances/{args.entityId}"
        method: "POST"
        bodyKey: payload
      ) {
      name
    }
  }
`

const userGroupUnassignGpl = gql`
  mutation Unassign($serviceId: String!, $entityType: String!, $entityId: String!, $payload: AssignmentPayload!) {
    unassign(serviceId: $serviceId, entityType: $entityType, entityId: $entityId, payload: $payload)
      @rest(
        path: "/platform/v1/reconciliation/assignments/services/{args.serviceId}/types/{args.entityType}/instances/{args.entityId}?action=unassign"
        method: "POST"
        bodyKey: payload
      ) {
      name
    }
  }
`

export const userGroupAssign: ApolloMutation<unknown, RecoAssignVariables> = {
  mutation: userGroupAssignGpl,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: UserUpdatePermissions,
}

export const userGroupUnassign: ApolloMutation<unknown, RecoAssignVariables> = {
  mutation: userGroupUnassignGpl,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: UserUpdatePermissions,
}
