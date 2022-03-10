//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { pick } from 'lodash-es'

import { ReportingServiceFilter, ReportingServiceMatch } from '@ues-data/gateway'
import type { Types } from '@ues-gateway/shared'

import { useEventsLocationState } from './use-events-location-state'

const SUPPORTED_FILTER_KEYS_IN_LOCATION_STATE: (keyof Types.GatewayEventsRouteQueryParams)[] = [
  ReportingServiceFilter.AlertAction,
  ReportingServiceFilter.AlertPolicyName,
  ReportingServiceFilter.NetworkRoute,
  ReportingServiceFilter.TlsVersion,
]

export const useReportingServiceFiltersFromLocationState = (): Types.GatewayEventsRouteQueryParams => {
  const locationState = useEventsLocationState()

  return {
    ...pick(locationState, SUPPORTED_FILTER_KEYS_IN_LOCATION_STATE),
    ...(locationState.destination && {
      destMatch: {
        str: locationState.destination,
        match: ReportingServiceMatch.Equals,
      },
    }),
  }
}
