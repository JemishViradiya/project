/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import type { GridRowScrollEndParams } from '@material-ui/x-grid'

import { useErrorCallback, useStatefulApolloQuery } from '@ues-data/shared'
import { QueryStringParamKeys } from '@ues-mtd/alert-types'
import {
  addDetected,
  alertLink,
  cleanUpParams,
  DetectedFilterComponent,
  formatDatetimeRange,
  idFunction,
  MobileAlertColumnNames,
  mobileAlertSummariesQuery,
  NameFilterComponent,
  resolveCheckboxFilter,
  resolveDatetimeRangeFilter,
  resolveQuickSearchFilter,
  TranslateType,
  TypeFilterComponent,
  useEventStateTypes,
  useMobileAlertsToolbar,
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

const TABLE_NAME = 'groupByDetectionMobileAlerts'

export function formatFiltersGroupByDetection(filters) {
  const ret = {}
  Object.entries(filters).forEach(filterProperty => {
    const key = filterProperty[0]
    const value = filterProperty[1]
    switch (key) {
      case MobileAlertColumnNames.Type:
        ret[QueryStringParamKeys.TYPE] = resolveCheckboxFilter(value)
        break
      case MobileAlertColumnNames.Name:
        ret[QueryStringParamKeys.NAME] = resolveQuickSearchFilter(value)
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
export const useMobileAlertsGroupByDetectionTable = () => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const { eventTypeItems, eventTypeItemLabels } = useEventStateTypes()
  const { enqueueMessage } = useSnackbar()
  const location = useLocation()
  const { search } = location
  const navigate = useNavigate()

  const sortingProps = useSort(MobileAlertColumnNames.Name, SORT_DIRECTION.ASC)
  const { sort, sortDirection } = sortingProps

  const columns = useMemo(
    () => [
      {
        label: t('mobileAlert.list.columns.name'),
        dataKey: MobileAlertColumnNames.Name,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
        gridColDefProps: { minWidth: 150, flex: 1 },
      },
      {
        label: t('mobileAlert.list.columns.type'),
        dataKey: MobileAlertColumnNames.Type,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <TypeFilterComponent items={eventTypeItems} itemLabels={eventTypeItemLabels} />,
        valueGetter: rowValue => TranslateType(rowValue.row.type, t),
        gridColDefProps: { minWidth: 150, flex: 1 },
      },
      {
        label: t('mobileAlert.list.columns.threatCount'),
        dataKey: MobileAlertColumnNames.ThreatCount,
        persistent: true,
        sortable: false,
        gridColDefProps: { minWidth: 150, flex: 1 },
        renderCell: rowData =>
          alertLink(rowData[MobileAlertColumnNames.ThreatCount], {
            name: rowData[MobileAlertColumnNames.Name],
            type: rowData[MobileAlertColumnNames.Type],
            detectedStart: rowData[MobileAlertColumnNames.FirstDetected],
            detectedEnd: rowData[MobileAlertColumnNames.LastDetected],
            status: '',
          }),
      },
      {
        label: t('mobileAlert.list.columns.deviceCount'),
        dataKey: MobileAlertColumnNames.DeviceCount,
        sortable: false,
        gridColDefProps: { minWidth: 150, flex: 1 },
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
    [t],
  )

  const defaultFilters = {}
  if (Boolean(search) && search.length !== 0) {
    const searchParams = new URLSearchParams(search)
    searchParams.get('type') &&
      (defaultFilters[MobileAlertColumnNames.Type] = {
        value: searchParams
          .get('type')
          .split(',')
          .filter(key => key && key.length > 0),
      })
    addDetected(defaultFilters, searchParams)
    searchParams.get('name') && (defaultFilters[MobileAlertColumnNames.Name] = { value: searchParams.get('name') })
  }

  useEffect(() => {
    navigate({
      search: cleanUpParams(new URLSearchParams(search)),
    })
  }, [navigate, search])

  const filterProps = useFilter(defaultFilters)
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, Object.assign({}, eventTypeItemLabels))

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('mobileAlert.list.columnPicker'),
    tableName: TABLE_NAME,
  })
  columnPickerProps.tableCell = false

  const mobileAlertsVariables = useMemo(() => {
    return {
      sortBy: sort.toUpperCase(),
      sortDirection: sortDirection.toUpperCase(),
      max: 50,
      filter: formatFiltersGroupByDetection(filterProps.activeFilters),
    }
  }, [sort, sortDirection, filterProps.activeFilters])

  const { data, error, loading, fetchMore } = useStatefulApolloQuery(mobileAlertSummariesQuery, {
    variables: mobileAlertsVariables,
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
        variables: { cursor: startIndex === 0 ? undefined : data?.mobileAlertSummaries?.cursor },
      }
      if (!data || !data?.mobileAlertSummaries?.hasMore) return
      await fetchMore(variables)
    },
    [data, fetchMore],
  )

  const tableProps = {
    rows: data?.mobileAlertSummaries?.elements ?? [],
    noRowsMessageKey: 'mtd/common:mobileAlert.list.noData',
    onRowsScrollEnd,
    tableName: TABLE_NAME,
  }

  const providerProps = {
    basicProps,
    sortingProps,
    data: data?.mobileAlertSummaries?.elements ?? [],
    filterProps,
  }

  const toolbarProps = useMobileAlertsToolbar({
    t,
    loadedItems: data?.mobileAlertSummaries?.elements?.length ?? 0,
    totalItems: null,
  })

  return {
    tableProps,
    toolbarProps,
    providerProps,
    filterPanelProps: { ...filterProps, ...filterLabelProps },
  }
}
