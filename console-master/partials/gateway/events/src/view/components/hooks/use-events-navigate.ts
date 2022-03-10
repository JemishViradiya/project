//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, omitBy } from 'lodash-es'
import { useNavigate } from 'react-router-dom'

import { Types, Utils } from '@ues-gateway/shared'

import { useEventsLocationState } from './use-events-location-state'

const { makePageRoute } = Utils

type UseEventsNavigateFn = () => (args: { groupBy?: Types.EventsGroupByParam } & Types.GatewayEventsRouteQueryParams) => void

export const useEventsNavigate: UseEventsNavigateFn = () => {
  const locationState = useEventsLocationState()
  const navigate = useNavigate()

  return ({ groupBy, ...restQueryStringParams }) =>
    navigate(
      makePageRoute(Types.Page.GatewayEvents, {
        params: { groupBy },
        queryStringParams: omitBy(
          {
            startDate: locationState?.startDate,
            endDate: locationState?.endDate,
            ...restQueryStringParams,
          },
          isEmpty,
        ),
      }),
    )
}
