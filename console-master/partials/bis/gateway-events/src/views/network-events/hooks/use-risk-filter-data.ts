import { useMemo } from 'react'

import { GatewayAlertsFiltersQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { useTableFilter } from '@ues/behaviours'

import { ColumnKey } from '../types'
import { convertFilterDateRangeToRangeVariable } from '../utils/filters'

interface UseRiskFilterDataOptions {
  userIds?: string[]
}

export const useRiskFilterData = ({ userIds }: UseRiskFilterDataOptions) => {
  const filterProps = useTableFilter()
  const detectionTimeFilter: any = filterProps.activeFilters?.[ColumnKey.DetectionTime]

  const variables = useMemo(
    () => ({
      range: convertFilterDateRangeToRangeVariable(detectionTimeFilter),
      type: 'identityAndBehavioralRiskLevel',
      userIds,
    }),
    [userIds, detectionTimeFilter],
  )

  const { data: queryResult } = useStatefulApolloQuery(GatewayAlertsFiltersQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables,
  })

  return useMemo(
    () =>
      queryResult?.eventFilters?.reduce<Record<string, number>>(
        (acc, { key, count }) => ({
          ...acc,
          [key]: count,
        }),
        {},
      ),
    [queryResult],
  )
}
