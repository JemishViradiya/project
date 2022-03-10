//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import type { OperationVariables } from '@apollo/client'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { getDateRangeTimestampString } from '@ues-behaviour/dashboard'
import type { ReportingServiceQueryVariables } from '@ues-data/gateway'
import type { ApolloQuery } from '@ues-data/shared'
import { useStatefulApolloQuery, useUesSession } from '@ues-data/shared'
import { Hooks } from '@ues-gateway/shared'

const { useBackendState } = Hooks

type UseDataLayerFn = <TResult extends unknown>(args: {
  defaultQueryVariables?: Partial<ReportingServiceQueryVariables>
  globalTime: ChartProps['globalTime']
  hasNoData?: (data: TResult) => boolean
  query: ApolloQuery<TResult, OperationVariables>
  skip?: boolean
}) => { data: TResult; startDate?: string; endDate?: string }

export const useDataLayer: UseDataLayerFn = ({ query, globalTime, hasNoData, defaultQueryVariables = {}, skip = false }) => {
  const { tenantId } = useUesSession()

  const { queryVariables, startDate, endDate } = useMemo(() => {
    const { startDate, endDate } = getDateRangeTimestampString(globalTime)

    return {
      queryVariables: { tenantId, fromDate: startDate, toDate: endDate, filter: {}, ...defaultQueryVariables },
      startDate,
      endDate,
    }
  }, [tenantId, globalTime, defaultQueryVariables])

  const { data, error } = useStatefulApolloQuery(query, { fetchPolicy: 'no-cache', variables: queryVariables, skip })

  useBackendState(error, data && hasNoData && hasNoData(data))

  return { data, startDate, endDate }
}
