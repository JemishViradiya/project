/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { EID_URL, UESAPI_URL } from '@ues-data/network'

import { APOLLO_DESTINATION } from '../providers/apollo/common'

export * as NetworkEnvironment from '@ues-data/network'

export * from './siteBase'
export * from './tracer'

export const NetworkServices = {
  [APOLLO_DESTINATION.BIG_REPORTING_SERVICE]: `${UESAPI_URL}/api/big/reporting/graphql`,
  [APOLLO_DESTINATION.BIS_PORTAL_SERVICE]: `${UESAPI_URL}/api/bis/v1/graphql`,
  [APOLLO_DESTINATION.THREAT_EVENTS_BFF]: `${UESAPI_URL}/api/mtd/v1/bff/threat-events/graphql`,
  [APOLLO_DESTINATION.PLATFORM_BFF]: `${UESAPI_URL}/api/platform/v1/bff/platform/graphql`,
  [APOLLO_DESTINATION.DASHBOARD_BFF]: `${UESAPI_URL}/api/platform/v1/bff/dashboard/graphql`,
  [APOLLO_DESTINATION.REST_API]: `${UESAPI_URL}/api`,
  [APOLLO_DESTINATION.EID_API]: `${EID_URL}/api`,
  [APOLLO_DESTINATION.VENUE_API]: '',
}
