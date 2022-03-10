//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { merge } from 'lodash-es'
import { useEffect, useMemo } from 'react'

import type { OperationVariables } from '@apollo/client'

import type { ReportingServiceQueryVariables } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'
import { useStatefulApolloLazyQuery } from '@ues-data/shared'
import { Utils } from '@ues-gateway/shared'

import { TIMESTAMP_ORDER_QUERY_KEY } from '../constants'
import type { EventsListName } from '../types'
import { useEventsLocationState } from './use-events-location-state'
import { useReportingServiceFiltersFromLocationState } from './use-reporting-service-filters-from-location-state'

const { makeDefaultDateRange } = Utils

type UseDataLayerFn = <TResult extends unknown>(
  dataLayer: ApolloQuery<TResult, OperationVariables>,
  defaultQueryVariables: ReportingServiceQueryVariables,
  listName: EventsListName,
) => {
  data: TResult
  loading: boolean
  triggerQuery: (options: OperationVariables) => void
  queryVariables: ReportingServiceQueryVariables
}

export const useDataLayer: UseDataLayerFn = (dataLayer, defaultQueryVariables, listName) => {
  const locationState = useEventsLocationState()
  const filter = useReportingServiceFiltersFromLocationState()

  const queryVariables = useMemo(
    () => {
      const { startDate, endDate } = makeDefaultDateRange(locationState)

      return merge(
        { fromRecord: 0, filter: { [TIMESTAMP_ORDER_QUERY_KEY[listName]]: { from: startDate, to: endDate } } },
        defaultQueryVariables,
        { filter },
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultQueryVariables],
  )

  /**
  @argument fetchPolicy: is set to 'no-cache' due to issues (caused by StrictMode) with cached graphQLfragments used in query and required by application
  */
  const [triggerQuery, { data, loading }] = useStatefulApolloLazyQuery(dataLayer, {
    notifyOnNetworkStatusChange: true,
    variables: queryVariables,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    triggerQuery({ variables: queryVariables })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryVariables])

  return { data, loading, triggerQuery, queryVariables }
}
