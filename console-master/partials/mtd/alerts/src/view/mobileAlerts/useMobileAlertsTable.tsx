/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { MobileProtectData } from '@ues-data/mtd'
import { useErrorCallback, useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'
import {
  addDetected,
  cleanUpParams,
  formatFilters,
  idFunction,
  ignoreAllMobileAlertsMutation,
  ignoreMobileAlertsMutation,
  MobileAlertColumnNames,
  mobileAlertsQuery,
  useDrawerProps,
  useEventStateTypes,
  useIgnoreMobileAlertsConfirmation,
  useMobileAlertColumns,
  useMobileAlertsToolbar,
} from '@ues-mtd/shared'
import {
  ColumnPicker,
  OPERATOR_VALUES,
  SORT_DIRECTION,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useServerSideSelection,
  useSnackbar,
  useSort,
} from '@ues/behaviours'

import { useExportMobileAlerts } from './useExportMobileAlerts'

const TABLE_NAME = 'mobileAlerts'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useMobileAlertsTable = () => {
  const { t, i18n } = useTranslation(['mtd/common'])
  const { eventTypeItems, eventTypeItemLabels, stateItems, stateItemsLabels } = useEventStateTypes()
  const { enqueueMessage } = useSnackbar()
  const location = useLocation()
  const navigate = useNavigate()
  const { search } = location

  const sortingProps = useSort(MobileAlertColumnNames.Detected, SORT_DIRECTION.DESC)
  const { sort, sortDirection } = sortingProps

  const columns = useMobileAlertColumns(t, i18n, eventTypeItems, eventTypeItemLabels, stateItems, stateItemsLabels)

  const defaultFilters = {}
  if (Boolean(search) && search.length !== 0) {
    const searchParams = new URLSearchParams(search)
    if (searchParams.get('status')) {
      defaultFilters[MobileAlertColumnNames.Status] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams
          .get('status')
          .split(',')
          .filter(key => key && key.length > 0),
      }
    } else if (!searchParams.has('status')) {
      defaultFilters[MobileAlertColumnNames.Status] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: [MobileProtectData.MobileThreatEventState.NEW],
      }
    }
    searchParams.get('type') &&
      (defaultFilters[MobileAlertColumnNames.Type] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams
          .get('type')
          .split(',')
          .filter(key => key && key.length > 0),
      })
    addDetected(defaultFilters, searchParams)
    searchParams.get('userName') &&
      (defaultFilters[MobileAlertColumnNames.UserName] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('userName'),
      })
    searchParams.get('deviceName') &&
      (defaultFilters[MobileAlertColumnNames.DeviceName] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('deviceName'),
      })
    searchParams.get('name') &&
      (defaultFilters[MobileAlertColumnNames.Name] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('name'),
      })
    searchParams.get('description') &&
      (defaultFilters[MobileAlertColumnNames.Description] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('description'),
      })
  } else {
    defaultFilters[MobileAlertColumnNames.Status] = {
      operator: OPERATOR_VALUES.IS_IN,
      value: [MobileProtectData.MobileThreatEventState.NEW],
    }
  }

  useEffect(() => {
    navigate({
      search: cleanUpParams(new URLSearchParams(search)),
    })
  }, [navigate, search])

  const filterProps = useFilter(defaultFilters)
  const filterLabelProps = useFilterLabels(
    filterProps.activeFilters,
    columns,
    Object.assign({}, eventTypeItemLabels, stateItemsLabels),
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('mobileAlert.list.columnPicker'),
    tableName: TABLE_NAME,
  })

  const { onLoadedSelect, selectionModel, countSelected, ...selectedProps } = useServerSideSelection({ idFunction })

  const [rowData, setRowData] = useState(null)
  const { isOpen, toggleDrawer, ignoreClickAway, setIgnoreClickAway } = useDrawerProps()

  const variables = useMemo(() => {
    return {
      sortBy: sort.toUpperCase(),
      sortDirection: sortDirection.toUpperCase(),
      max: 50,
      filter: formatFilters(true, filterProps.activeFilters),
    }
  }, [sort, sortDirection, filterProps.activeFilters])

  const { data, error, loading, fetchMore, refetch } = useStatefulApolloQuery(mobileAlertsQuery, {
    variables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })
  useErrorCallback(error, () => enqueueMessage(t('mobileAlert.errorMessageGeneric'), 'error'))

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} tableCell={false} {...props} />,
      idFunction,
      loading,
    }),
    [columnPickerProps, displayedColumns, loading],
  )

  const unselectAll = () => {
    providerProps?.selectedProps.resetSelectedItems()
  }

  const onIgnoreError = error => {
    enqueueMessage(error.message, 'error')
  }

  const onIgnoreSuccess = useCallback(
    data => {
      selectedProps.resetSelectedItems()
      refetch(variables)
      if (selectionModel.allSelected) {
        enqueueMessage(t('mobileAlert.ignore.successIgnoreAllMessage'), 'success')
      } else {
        enqueueMessage(t('mobileAlert.ignore.successMessage', { selected: data?.ignoreMobileAlerts?.count }), 'success')
      }
      if (data?.ignoreMobileAlerts?.status === 'COMPLETED_WITH_ERRORS') {
        enqueueMessage(data?.ignoreMobileAlerts?.errors, 'warning')
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch, selectedProps, variables],
  )

  const [ignoreAllMobileAlertsFn] = useStatefulApolloMutation(ignoreAllMobileAlertsMutation, {
    onError: onIgnoreError,
    onCompleted: onIgnoreSuccess,
    variables: { filter: null, mobileAlertIds: [] },
  })

  const [ignoreMobileAlertsFn] = useStatefulApolloMutation(ignoreMobileAlertsMutation, {
    onError: onIgnoreError,
    onCompleted: onIgnoreSuccess,
    variables: { mobileAlertIds: [] },
  })

  const onIgnore = (ids: { string }[]) => {
    if (selectionModel.allSelected) {
      ignoreAllMobileAlertsFn({
        variables: { filter: formatFilters(true, providerProps?.filterProps?.activeFilters), mobileAlertIds: ids },
      }).then()
    } else if (ids.length >= 1) {
      ignoreMobileAlertsFn({ variables: { mobileAlertIds: ids } }).then()
    }
  }

  const { exportAction } = useExportMobileAlerts(columns, filterProps, sortingProps)

  const onRowsScrollEnd = useCallback(async () => {
    const variables = {
      variables: { cursor: data?.mobileAlerts?.cursor },
    }
    if (!data?.mobileAlerts || !data?.mobileAlerts?.hasMore) return
    const result = await fetchMore(variables)
    onLoadedSelect(result.data.mobileAlerts.elements)
  }, [data, fetchMore, onLoadedSelect])

  const onRowClick = (rowDataClick: any) => {
    setIgnoreClickAway(true)
    if (rowDataClick?.row?.id === rowData?.row?.id || !isOpen) {
      toggleDrawer()
    }
    setRowData(rowDataClick)
  }

  const drawerProps = {
    rowData: rowData,
    isOpen: isOpen,
    toggleDrawer: toggleDrawer,
    ignoreClickAway: ignoreClickAway,
    setIgnoreClickAway: setIgnoreClickAway,
  }

  const tableProps = {
    rows: data?.mobileAlerts?.elements ?? [],
    noRowsMessageKey: 'mtd/common:mobileAlert.list.noData',
    onRowsScrollEnd,
    checkboxSelection: true,
    onRowClick,
    tableName: TABLE_NAME,
  }

  const providerProps = {
    basicProps,
    sortingProps,
    selectedProps,
    filterProps,
  }

  const { confirmationOptions, confirmIgnore } = useIgnoreMobileAlertsConfirmation(
    selectionModel.allSelected,
    unselectAll,
    onIgnore,
  )

  const toolbarProps = useMobileAlertsToolbar({
    t,
    selectedIds: providerProps?.selectedProps.selected,
    loadedItems: data?.mobileAlerts?.elements.length ?? 0,
    totalItems: data?.mobileAlerts?.totals.elements ?? 0,
    onIgnore: () => {
      confirmIgnore(selectionModel.selected)
    },
    selectionModel,
    exportAction,
  })

  return {
    tableProps,
    toolbarProps,
    providerProps,
    filterPanelProps: { ...filterProps, ...filterLabelProps },
    confirmationOptions,
    drawerProps,
  }
}
