import { useCallback, useEffect, useMemo, useRef } from 'react'

import { GatewayAlertsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { TABLE_LAZY_LOADING_BATCH_SIZE, TABLE_LAZY_LOADING_THRESHOLD } from '../config'
import { useTableQueryVariables } from './use-table-query-variables'

interface UseTableDataOptions {
  filterProps: any
  sortProps: any
  userIds?: string[]
  containerIds?: string[]
}

export const useTableData = ({ filterProps, sortProps, userIds, containerIds }: UseTableDataOptions) => {
  const variables = useTableQueryVariables({
    filterProps,
    size: TABLE_LAZY_LOADING_BATCH_SIZE,
    sortProps,
    userIds,
    containerIds,
  })

  const { data: queryResult, error, loading, fetchMore, refetch } = useStatefulApolloQuery(GatewayAlertsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables,
  })

  const refetchRef = useRef(refetch)

  useEffect(() => {
    refetchRef.current = refetch
  }, [refetch])

  useEffect(() => {
    if (refetchRef.current) {
      refetchRef.current(variables)
    }
  }, [variables])

  const { events, total } = useMemo(
    () => ({
      events: (!loading && queryResult?.eventInfiniteScroll?.events) || [],
      total: queryResult?.eventInfiniteScroll?.total ?? 0,
    }),
    [queryResult, loading],
  )

  const onLoadMoreRows = useCallback(
    async ({ startIndex }) => {
      await fetchMore({ variables: { ...variables, offset: startIndex } })
    },
    [variables, fetchMore],
  )

  const infinitLoader = useMemo(
    () => ({
      isRowLoaded: ({ index }: { index: number }) => events[index] !== undefined,
      loadMoreRows: onLoadMoreRows,
      rowCount: total,
      threshold: TABLE_LAZY_LOADING_THRESHOLD,
      minimumBatchSize: TABLE_LAZY_LOADING_BATCH_SIZE,
    }),
    [onLoadMoreRows, events, total],
  )

  return {
    error,
    data: events,
    loading,
    infinitLoader,
    total,
  }
}
