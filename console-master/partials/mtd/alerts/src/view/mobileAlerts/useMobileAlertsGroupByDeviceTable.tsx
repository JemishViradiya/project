/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Link } from '@material-ui/core'
import type { GridRowScrollEndParams } from '@material-ui/x-grid'

import { useErrorCallback, useStatefulApolloQuery } from '@ues-data/shared'
import { QueryStringParamKeys } from '@ues-mtd/alert-types'
import {
  addDetected,
  cleanUpParams,
  DetectedFilterComponent,
  DeviceNameFilterComponent,
  formatDatetimeRange,
  idFunction,
  MobileAlertColumnNames,
  mobileDevicesWithAlertsQuery,
  resolveDatetimeRangeFilter,
  resolveQuickSearchFilter,
  useEventStateTypes,
  useMobileAlertsToolbar,
  UserNameFilterComponent,
} from '@ues-mtd/shared'
import {
  ColumnPicker,
  FILTER_TYPES,
  SORT_DIRECTION,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

const TABLE_NAME = 'groupByDeviceMobileAlerts'

export function formatFiltersGroupByDevice(filters) {
  const ret = {}
  Object.entries(filters).forEach(filterProperty => {
    const key = filterProperty[0]
    const value = filterProperty[1]
    switch (key) {
      case MobileAlertColumnNames.DeviceName:
        ret[QueryStringParamKeys.DEVICE_NAME] = resolveQuickSearchFilter(value)
        break
      case MobileAlertColumnNames.UserName:
        ret[QueryStringParamKeys.USER_NAME] = resolveQuickSearchFilter(value)
        break
      case MobileAlertColumnNames.Detected: {
        const resolvedDatetimeRangeFilter = resolveDatetimeRangeFilter(value)
        ret[QueryStringParamKeys.DETECTED_START] = resolvedDatetimeRangeFilter['startDateTime']
        ret[QueryStringParamKeys.DETECTED_END] = resolvedDatetimeRangeFilter['endDateTime']
        break
      }
    }
  })
  return ret
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useMobileAlertsGroupByDeviceTable = () => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const { eventTypeItemLabels } = useEventStateTypes()
  const { enqueueMessage } = useSnackbar()
  const location = useLocation()
  const { search } = location
  const navigate = useNavigate()
  const [startFilter, setStartFilter] = React.useState<string>(null)
  const [endFilter, setEndFilter] = React.useState<string>(null)

  const deviceAlertLink = rowData => {
    const query = { status: '' }
    if (startFilter !== null) {
      query[QueryStringParamKeys.DETECTED_START] = startFilter
    }
    if (endFilter !== null) {
      query[QueryStringParamKeys.DETECTED_END] = endFilter
    }
    return (
      <Link
        href={
          `uc/platform#/mobile-devices/${rowData[MobileAlertColumnNames.EndpointIds][0]}/alerts?` +
          new URLSearchParams((query as any) as string).toString()
        }
      >
        {rowData[MobileAlertColumnNames.ThreatCount]}
      </Link>
    )
  }

  const columns = React.useMemo(
    () => [
      {
        label: t('mobileAlert.list.columns.device'),
        dataKey: MobileAlertColumnNames.DeviceName,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DeviceNameFilterComponent />,
        gridColDefProps: { minWidth: 150, flex: 1 },
      },
      {
        label: t('mobileAlert.list.columns.user'),
        dataKey: MobileAlertColumnNames.UserName,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <UserNameFilterComponent />,
        gridColDefProps: { minWidth: 150, flex: 1 },
      },
      {
        label: t('mobileAlert.list.columns.threatCount'),
        persistent: true,
        dataKey: MobileAlertColumnNames.ThreatCount,
        sortable: false,
        gridColDefProps: { minWidth: 150, flex: 1 },
        renderCell: rowData =>
          Array.isArray(rowData[MobileAlertColumnNames.EndpointIds]) && rowData[MobileAlertColumnNames.EndpointIds].length !== 0
            ? deviceAlertLink(rowData)
            : rowData[MobileAlertColumnNames.ThreatCount],
      },
      {
        label: t('mobileAlert.list.columns.detection'),
        dataKey: MobileAlertColumnNames.Detected,
        sortable: false,
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <DetectedFilterComponent />,
        renderCell: rowData => formatDatetimeRange(rowData, i18n),
        gridColDefProps: { minWidth: 150, flex: 1 },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, startFilter, endFilter],
  )

  const sortingProps = useSort(MobileAlertColumnNames.DeviceName, SORT_DIRECTION.ASC)
  const { sort, sortDirection } = sortingProps

  const defaultFilters = {}
  if (Boolean(search) && search.length !== 0) {
    const searchParams = new URLSearchParams(search)
    addDetected(defaultFilters, searchParams)
    searchParams.get('userName') && (defaultFilters[MobileAlertColumnNames.UserName] = { value: searchParams.get('userName') })
    searchParams.get('deviceName') &&
      (defaultFilters[MobileAlertColumnNames.DeviceName] = { value: searchParams.get('deviceName') })
  }

  useEffect(() => {
    navigate({
      search: cleanUpParams(new URLSearchParams(search)),
    })
  }, [navigate, search])

  const filterProps = useFilter(defaultFilters)
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, Object.assign({}, eventTypeItemLabels))

  useEffect(() => {
    const filters = formatFiltersGroupByDevice(filterProps.activeFilters)
    setStartFilter(filters[QueryStringParamKeys.DETECTED_START] ?? null)
    setEndFilter(filters[QueryStringParamKeys.DETECTED_END] ?? null)
  }, [filterProps])

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('mobileAlert.list.columnPicker'),
    tableName: TABLE_NAME,
  })
  columnPickerProps.tableCell = false

  const variables = useMemo(() => {
    return {
      sortBy: sort.toUpperCase(),
      sortDirection: sortDirection.toUpperCase(),
      max: 50,
      filter: formatFiltersGroupByDevice(filterProps.activeFilters),
    }
  }, [sort, sortDirection, filterProps.activeFilters])

  const { data, error, loading, fetchMore } = useStatefulApolloQuery(mobileDevicesWithAlertsQuery, {
    variables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })
  useErrorCallback(error, () => enqueueMessage(t('mobileAlert.errorMessageGeneric'), 'error'))

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      loading,
    }),
    [columnPickerProps, displayedColumns, loading],
  )

  const onRowsScrollEnd = useCallback(
    async ({ viewportPageSize: startIndex }: GridRowScrollEndParams) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.mobileDevicesWithAlerts?.cursor },
      }
      if (!data || !data?.mobileDevicesWithAlerts?.hasMore) return
      await fetchMore(variables)
    },
    [data, fetchMore],
  )

  const tableProps = {
    rows: data?.mobileDevicesWithAlerts?.elements ?? [],
    noRowsMessageKey: 'mtd/common:mobileAlert.list.noData',
    onRowsScrollEnd,
    tableName: TABLE_NAME,
  }

  const providerProps = {
    basicProps,
    sortingProps,
    data: data?.mobileDevicesWithAlerts?.elements ?? [],
    filterProps,
  }

  const toolbarProps = useMobileAlertsToolbar({
    t,
    loadedItems: data?.mobileDevicesWithAlerts?.elements?.length ?? 0,
    totalItems: null,
  })

  return {
    tableProps,
    toolbarProps,
    providerProps,
    filterPanelProps: { ...filterProps, ...filterLabelProps },
  }
}
