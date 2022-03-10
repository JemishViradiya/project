/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { GridRowParams } from '@material-ui/x-grid'

import { useErrorCallback, useStatefulApolloQuery } from '@ues-data/shared'
import { ColumnPicker, SORT_DIRECTION, useColumnPicker, useFilter, useFilterLabels, useSnackbar, useSort } from '@ues/behaviours'

import { MobileAlertColumnNames, mobileAlertsQuery } from '../../data/index'
import { useMobileAlertsToolbar } from '../../index'
import { createPartialMobileAlertColumns, formatFiltersByUserAndDevice, idFunction } from './common'
import { useDrawerProps } from './drawer'
import type { UseMobileAlertsReturn } from './types'
import { useEventStateTypes } from './useEventStateTypes'

export const useMobileAlertsCustomTable = (
  tableName: string,
  filteredColumns: MobileAlertColumnNames[],
  fixedFilters: Record<string, string>,
  defaultFilters,
): UseMobileAlertsReturn => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const { eventTypeItems, eventTypeItemLabels, stateItems, stateItemsLabels } = useEventStateTypes()
  const { enqueueMessage } = useSnackbar()
  const sortingProps = useSort(MobileAlertColumnNames.Detected, SORT_DIRECTION.DESC)
  const { sort, sortDirection } = sortingProps

  const columns = useMemo(() => {
    return createPartialMobileAlertColumns(
      t,
      i18n,
      eventTypeItems,
      eventTypeItemLabels,
      stateItems,
      stateItemsLabels,
      filteredColumns,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  const filterProps = useFilter(defaultFilters)
  const filterLabelProps = useFilterLabels(
    filterProps.activeFilters,
    columns,
    Object.assign({}, eventTypeItemLabels, stateItemsLabels),
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('mobileAlert.list.columnPicker'),
    tableName,
  })
  columnPickerProps.tableCell = false

  const mobileAlertsVariables = useMemo(() => {
    return {
      sortBy: sort.toUpperCase(),
      sortDirection: sortDirection.toUpperCase(),
      max: 50,
      filter: formatFiltersByUserAndDevice(true, filterProps.activeFilters, fixedFilters),
    }
  }, [filterProps.activeFilters, fixedFilters, sort, sortDirection])

  const { data, error, loading, fetchMore, refetch: refetchMobileAlerts } = useStatefulApolloQuery(mobileAlertsQuery, {
    variables: mobileAlertsVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  React.useEffect(() => {
    refetchMobileAlerts()
  }, [refetchMobileAlerts])

  const handleOnRowsScrollEnd = useCallback(
    async ({ startIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.mobileAlerts?.cursor },
      }
      if (!data || !data?.mobileAlerts?.hasMore) return
      await fetchMore(variables)
    },
    [data, fetchMore],
  )

  const toolbarProps = useMobileAlertsToolbar({
    t,
    loadedItems: data?.mobileAlerts?.elements.length ?? 0,
    totalItems: data?.mobileAlerts?.totals.elements ?? 0,
    showGroupBy: false,
  })

  useErrorCallback(error, () => enqueueMessage(t('mobileAlert.errorMessageGeneric'), 'error'))

  const [rowData, setRowData] = useState(null)
  const { isOpen, toggleDrawer, ignoreClickAway, setIgnoreClickAway } = useDrawerProps()

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      loading,
    }),
    [columnPickerProps, displayedColumns, loading],
  )

  const onRowClick = (rowDataClick: GridRowParams) => {
    setIgnoreClickAway(true)
    if (rowDataClick?.row?.id === rowData?.row?.id || !isOpen) {
      toggleDrawer()
    }
    setRowData(rowDataClick)
  }

  const tableProps = {
    rows: data?.mobileAlerts?.elements ?? [],
    noRowsMessageKey: 'mtd/common:mobileAlert.list.noData',
    onRowsScrollEnd: handleOnRowsScrollEnd,
    onRowClick: onRowClick,
    tableName,
  }

  const providerProps = {
    sortingProps,
    basicProps,
    data: data?.mobileAlerts?.elements ?? [],
    filterProps,
  }

  const drawerProps = {
    rowData: rowData,
    isOpen: isOpen,
    toggleDrawer: toggleDrawer,
    ignoreClickAway: ignoreClickAway,
    setIgnoreClickAway: setIgnoreClickAway,
  }

  return {
    tableProps,
    providerProps,
    filterPanelProps: { ...filterProps, ...filterLabelProps },
    drawerProps,
    toolbarProps,
  }
}
