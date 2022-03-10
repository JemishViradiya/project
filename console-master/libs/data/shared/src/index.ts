import { getApolloCachedValue } from './utils/apollo'

/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export * from './lib'
export * from './network/axios'
export * from './network/fetch'
export * from './network/'

export * from './providers/apollo'
export * from './providers/redux'

export * from './cache/idb'
export * from './console'
export * from './featurization'
export * from './permissions'
export * from './service'

export * from './utils/use-previous'
export * from './utils/serialize-query-param'
export * from './utils/error'
export * from './utils/serialize-params'

export const ApolloDataUtils = {
  getApolloCachedValue,
}
export * from './shared/overrideEnvironmentVariable'
export * from './shared/useOverrideChange'

export type {
  Response,
  EffectiveEntities,
  EffectiveUsersPolicy,
  EffectiveEntityDetails,
  ReconciliationEntityId,
  ReconciliationEntity,
  PagableResponse,
  ReconciliationEntityDefinition,
} from './types'
export { EgressHealthConnectorState, ReconciliationEntityType, ServiceId, RiskLevel } from './types'

export { makePageableResponse } from './types'
