import { ServiceId } from '@ues-data/shared-types'

import { ActionType } from './ActionType'

export const ActionDefinition = {
  [ActionType.OverrideNetworkAccessControlPolicy]: {
    actionType: ActionType.OverrideNetworkAccessControlPolicy,
    pillarTypeId: ServiceId.BIG,
  },
  [ActionType.ReAuthenticateToConfirm]: { actionType: ActionType.ReAuthenticateToConfirm, pillarTypeId: ServiceId.BIS },
}
