import { gql } from '@apollo/client'

import type { ApolloMutation, ReconciliationEntityType } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext } from '@ues-data/shared'

import { Action, getPolicyPermission } from '../shared/permissions'

interface RecoEntityRankView {
  entityId: string
  rank: number
}

export interface RecoRankVariables {
  serviceId: string
  entityType: string
  payload: RecoEntityRankView[]
}

const rankUpdateGpl = gql`
  mutation RankUpdate($serviceId: String!, $entityType: String!, $payload: [RecoEntityRankView]!) {
    updateRank(serviceId: $serviceId, entityType: $entityType, payload: $payload)
      @rest(
        path: "/platform/v1/reconciliation/entities/services/{args.serviceId}/types/{args.entityType}/instances"
        method: "PATCH"
        bodyKey: payload
      ) {
      name
    }
  }
`

export const rankUpdate: ApolloMutation<unknown, RecoRankVariables> = {
  mutation: rankUpdateGpl,
  mockMutationFn: () => Promise.resolve(),
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: (vars: RecoRankVariables) => getPolicyPermission(Action.UPDATE, vars.entityType as ReconciliationEntityType),
}
