import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { queryEndpoints } from '@ues-data/platform'
import { Permission, useErrorCallback, usePermissions, usePrevious, useStatefulApolloQuery } from '@ues-data/shared'
import { idsChanged } from '@ues-platform/shared'
import {
  ColumnPicker,
  OPERATOR_VALUES,
  useColumnPicker,
  useFilter,
  useServerSideSelection,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

import { useColumns } from './filters'
import { useDeleteEndpoint } from './useDeleteEndpoint'
import { useExport } from './useExport'
import { buildDevicesQuery } from './utils'

const idFunction = (rowData: any) => rowData.endpointId

const FETCH_BATCH_SIZE = 60

const TABLE_NAME = 'mobileDevicesTable'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useDevicesTable = () => {
  const { t } = useTranslation(['platform/endpoints'])
  const { enqueueMessage } = useSnackbar()
  const [loadingMore, setLoadingMore] = useState(false)
  const location = useLocation()
  const { search } = location
  const { hasPermission } = usePermissions()
  const canDelete = hasPermission(Permission.ECS_DEVICES_DELETE)

  // TODO: enable when we have add/remove and poll/refresh integrated
  // const skip = !usePreloadApolloCacheFromIdb(PlatformEndpointsCache, variables)
  const sortingProps = useSort('enrollmentTime', 'desc')
  const { sort, sortDirection } = sortingProps
  const columns = useColumns()
  const columnPickerOverrides = []

  const defaultFilters = {}

  if (Boolean(search) && search.length !== 0) {
    const searchParams = new URLSearchParams(search)
    if (searchParams.get('osPlatform')) {
      defaultFilters['osPlatform'] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: [searchParams.get('osPlatform')],
      }
      columnPickerOverrides.push('osPlatform')
    }
    if (searchParams.get('osVersion')) {
      defaultFilters['osVersion'] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: [searchParams.get('osVersion')],
      }
      columnPickerOverrides.push('osVersion')
    }
    if (searchParams.get('osSecurityPatch')) {
      columns.forEach(column => {
        if (column.dataKey === 'osSecurityPatch') {
          column['show'] = true
        }
      })
      defaultFilters['osSecurityPatch'] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: [searchParams.get('osSecurityPatch')],
      }
      columnPickerOverrides.push('osSecurityPatch')
    }
  }

  const filterProps = useFilter(defaultFilters)

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('endpoint.columnPickerTitle'),
    tableName: TABLE_NAME,
    columnPickerOverrides,
  })
  const { onLoadedSelect, selectionModel, countSelected, ...selectedProps } = useServerSideSelection({ idFunction })

  const variables = useMemo((): queryEndpoints.QueryEndpoints => {
    const query = buildDevicesQuery(filterProps.activeFilters)
    return { sortBy: sort, sortDirection, query, offset: 0, limit: FETCH_BATCH_SIZE }
  }, [sort, sortDirection, filterProps.activeFilters])

  const variablesRef = useRef<queryEndpoints.QueryEndpoints>(variables)
  if (variables !== usePrevious(variables)) {
    variablesRef.current = variables
  }

  const { data, loading, error, fetchMore, refetch } = useStatefulApolloQuery(queryEndpoints, {
    variables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
    partialRefetch: true,
  })
  useErrorCallback(error, () => enqueueMessage(t('endpoints.details.error.fetch'), 'error'))

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} tableCell={false} {...props} />,
      idFunction,
      loading: loading || loadingMore,
      totalCount: data?.platformEndpoints?.totals?.elements ?? 0,
    }),

    [data?.platformEndpoints?.totals?.elements, displayedColumns, columnPickerProps, loading, loadingMore],
  )

  const onSuccessDelete = useCallback(() => {
    selectedProps.resetSelectedItems()
    refetch(variables)
  }, [refetch, selectedProps, variables])

  const { onDelete, deleteInProgress } = useDeleteEndpoint(
    countSelected(data?.platformEndpoints?.totals?.elements ?? 0),
    selectionModel,
    onSuccessDelete,
    variables?.query,
  )

  const { exportAction } = useExport(columns, filterProps)

  const onRowsScrollEnd = useCallback(
    async params => {
      const { limit } = variablesRef.current
      const nextOffset = data?.platformEndpoints?.elements.length ?? 0
      const nextOffsetEnd = nextOffset + limit
      if (!data || data?.platformEndpoints?.elements.length === data?.platformEndpoints?.totals?.elements) return

      setLoadingMore(true)
      variablesRef.current = {
        ...variablesRef.current,
        offset: nextOffset,
        limit: nextOffsetEnd - nextOffset,
      }
      const result = await fetchMore({
        variables: { offset: variablesRef.current.offset, limit: variablesRef.current.limit },
      })
      onLoadedSelect(result?.data?.platformEndpoints?.elements ?? [])
      setLoadingMore(false)
    },
    [data, fetchMore, onLoadedSelect],
  )

  const prevData = usePrevious(data?.platformEndpoints?.elements ?? [])
  useEffect(() => {
    const reselectFunc = async data => {
      if (idsChanged(prevData.map(e => idFunction(e)) ?? [], data?.platformEndpoints?.elements.map(e => idFunction(e)) ?? [])) {
        onLoadedSelect(data?.platformEndpoints?.elements ?? [], true)
      }
    }
    reselectFunc(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    tableProps: {
      rows: data?.platformEndpoints?.elements ?? [],
      onRowsScrollEnd,
      checkboxSelection: canDelete,
      tableName: TABLE_NAME,
    },
    providerProps: { basicProps, sortingProps, filterProps, selectedProps },
    onDelete: onDelete,
    showLoading: deleteInProgress,
    selectedCount: countSelected(data?.platformEndpoints?.totals?.elements ?? 0),
    selectionModel,
    exportAction,
  }
}
