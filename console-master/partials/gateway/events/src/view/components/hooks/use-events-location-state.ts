//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useSearchParams } from 'react-router-dom'

import type { Types } from '@ues-gateway/shared'

export const useEventsLocationState = (): Types.GatewayEventsRouteQueryParams => {
  const [searchParams] = useSearchParams()

  const locationStateValues = {}

  searchParams.forEach((value, key) => (locationStateValues[key] = value))

  return locationStateValues
}
