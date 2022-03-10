/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { TFunction } from 'i18next'
import { isEmpty } from 'lodash-es'
import type { Moment } from 'moment'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton, Link } from '@material-ui/core'
import Icon from '@material-ui/core/SvgIcon/SvgIcon'

// import { EVENTS_SORT_BY, EventsData } from '@ues-data/dlp'
import { EVENTS_SORT_BY, EvidenceLockerData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Hooks } from '@ues-info/shared'
import { BasicDelete, BasicDownload, I18nFormats, useTextCellStyles } from '@ues/assets'
import type { SimpleFilter, TableProviderProps } from '@ues/behaviours'
import {
  ColumnPicker,
  DatePickerFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  useColumnPicker,
  useDatePickerFilter,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useRadioFilter,
  useServerSideSelection,
  useSnackbar,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useEvidenceLockerPermissions } from './useEvidenceLockerPermission'
import { useEvidenceLockerToolbar } from './useEvidenceLockerToolbar'
// import { buildEventListQuery } from './utils'

const TABLE_NAME = 'evidenceLockerList'
const FETCH_BATCH_SIZE = 200

const CreatedTimeFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: 'created', defaultOperator: OPERATOR_VALUES.EQUAL })
  return <DatePickerFilter label={label} operators={null} {...props} />
})

const FileNameFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'fileName', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const FileSizeFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'size', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

type UseEvidenceLockerReturn = {
  tableProps: any
  providerProps: Omit<TableProviderProps, 'children'>
  filterPanelProps: any
  toolbarProps?: any
}

// TODO add correct default filter
// const DEFAULT_SORT_BY = `${EVENTS_SORT_BY.violationTime}_DESC`
const idFunction = rowData => rowData?.fileHash

const handleDownload = () => {
  // TODO add correct download action
  console.log('download click!!')
}

export const useEvidenceLockerTableProps = (): UseEvidenceLockerReturn => {
  const { t, i18n } = useTranslation(['dlp/common', 'tables'])
  const snackbar = useSnackbar()
  const locationState = Hooks.useEventsLocationState()
  const [tableData, setTableData] = useState([])
  const [urlQueryParams, setUrlQueryParams] = useState({})
  const [evidenceLockerQueryVariables, setEvidenceLockerQueryVariables] = useState({})
  const { ...rest } = locationState
  const { ellipsisTextCell } = useTextCellStyles()
  const { canReadEvidenceLocker, canReadFle, canDeleteFile, canReadEvents } = useEvidenceLockerPermissions()
  const eventsPagePath = '/uc/info#/events'
  const { onLoadedSelect, countSelected, selectionModel, ...selectedProps } = useServerSideSelection({ idFunction })
  const columns = useMemo(
    () => [
      {
        label: t('evidenceLocker.columns.created'),
        dataKey: 'created',
        sortable: false,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.DATE_PICKER,
        renderCell: rowData => {
          return <div>{i18n.format(rowData['created'], I18nFormats.DateTimeForEvents)}</div>
        },
        renderFilter: () => <CreatedTimeFilterComponent label={t('evidenceLocker.filter.created')} />,
        width: 10,
      },
      {
        label: t('evidenceLocker.columns.fileName'),
        dataKey: 'fileName',
        sortable: false,
        show: true,
        persistent: true,
        width: 30,
      },
      {
        label: t('evidenceLocker.columns.size'),
        dataKey: 'size',
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        width: 10,
      },
      {
        label: t('evidenceLocker.columns.events'),
        dataKey: 'events',
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        hidden: !canReadEvents,
        //renderFilter: () => <ActivityFilterComponent fieldName="eventType" t={t} label={t('evidenceLocker.filter.activity')} />,
        renderCell: rowData => {
          return rowData?.count > 0 ? (
            <Link
              variant="inherit"
              color="primary"
              href={`${eventsPagePath}?fileHash=${rowData?.fileHash}`}
              onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
            >
              <span>{rowData?.count ?? 0}</span>
            </Link>
          ) : (
            0
          )
        },
        width: 5,
      },
      {
        label: t('evidenceLocker.columns.download'),
        dataKey: 'download',
        icon: true,
        sortable: false,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: (rowData: any) => {
          return (
            <IconButton size="small" onClick={handleDownload} disabled={!canReadFle}>
              <Icon component={BasicDownload} />
            </IconButton>
          )
        },
        width: 30,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const sortingProps = useSort('fileName', 'desc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})
  // const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, getFilterLabels(t))
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  // Filtering queries in request url
  // TODO add filterQuery in scope of filter task
  // const filterQuery = useMemo(() => buildEventListQuery(filterProps.activeFilters), [filterProps.activeFilters])
  // useEffect(
  //   () => {
  //     setUrlQueryParams({ ...rest, ...filterQuery })
  //   }, // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [filterQuery],
  // )

  // TODO add correct variables
  // const variables = useMemo(
  //   () => {
  //     const initialSearchQueryParams = {
  //       sortBy: `${EVENTS_SORT_BY[sort]}_${sortDirection.toUpperCase()}` || DEFAULT_SORT_BY,
  //       limit: FETCH_BATCH_SIZE,
  //     }
  //     const result = !Object.keys(urlQueryParams).length
  //       ? initialSearchQueryParams
  //       : { ...initialSearchQueryParams, ...urlQueryParams }
  //     console.debug(`variables = ${JSON.stringify(result)}`)
  //     setEvidenceLockerQueryVariables(result)
  //     return result
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [urlQueryParams, sort, sortDirection],
  // )

  // TODO add correct variablesRequest
  // const variablesRequest = useMemo(
  //   () => ({ queryParams: evidenceLockerQueryVariables }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [evidenceLockerQueryVariables],
  // )

  const {
    error: evidenceLockerError,
    loading: evidenceLockerLoading,
    data: evidenceLockerData,
    refetch,
    fetchMore,
  } = useStatefulReduxQuery(EvidenceLockerData.queryEvidenceLockerList /*{ variables: variablesRequest }*/)

  useEffect(() => {
    if (evidenceLockerError && !evidenceLockerLoading) {
      // TODO: enhance error handler
      snackbar.enqueueMessage(t('evidenceLocker.serverError.retrieveEvents'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evidenceLockerError, evidenceLockerLoading, t])
  const data = evidenceLockerData

  useEffect(
    () => {
      if (evidenceLockerData) {
        setTableData([...tableData, ...evidenceLockerData?.elements.filter(elem => elem.fileName)])
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [evidenceLockerData],
  )

  useEffect(
    () => {
      if (evidenceLockerData) {
        setTableData([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortingProps.sort, sortingProps.sortDirection], // TODO add filterQuery in dependencies
  )

  const onLoadMoreRows = useCallback(
    // TODO In some cases cursor endpoint is calling initially event user does not scroll down table content. Should be fixed!!
    async () => {
      if (
        !isEmpty(evidenceLockerQueryVariables) &&
        (evidenceLockerData?.navigation?.next || (evidenceLockerData?.navigation?.next && evidenceLockerData?.navigation?.previous))
      ) {
        const result = await fetchMore({
          queryParams: { ...evidenceLockerQueryVariables, cursor: evidenceLockerData.navigation.next },
        })
        console.log('result', result)
      }
      // onLoadedSelect() - check if will be necessary at all when API will be working
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [evidenceLockerData, fetchMore /*variables*/],
  )

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      filterProps: filterProps,
      loading: evidenceLockerLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const tableProps = {
    rows: tableData ?? [],
    tableName: TABLE_NAME,
    noRowsMessageKey: 'tables:noData',
    onRowsScrollEnd: onLoadMoreRows,
    checkboxSelection: canDeleteFile,
  }

  const providerProps = {
    sortingProps,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
    selectedProps,
  }

  const toolbarProps = useEvidenceLockerToolbar({
    t,
    selectedIds: providerProps?.selectedProps.selected,
    totalItems: evidenceLockerData?.totals?.elements,
    onDelete: () => {
      // TODO add delete action
      console.log('Delete items: ', selectionModel.selected)
    },
    selectionModel,
  })

  return {
    toolbarProps,
    tableProps,
    providerProps,
    filterPanelProps: { ...filterProps, ...filterLabelProps },
  }
}
