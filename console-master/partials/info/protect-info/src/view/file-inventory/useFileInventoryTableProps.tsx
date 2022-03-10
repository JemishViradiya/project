/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { FILE_INVENTORY_SORT_BY, FileInventoryData, INFO_TYPES } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Hooks } from '@ues-info/shared'
import type { SimpleFilter, TableProviderProps } from '@ues/behaviours'
import {
  CheckboxFilter,
  ColumnPicker,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  useCheckboxFilter,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useSnackbar,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { buildFileInventoryListQuery, buildFileInventorySearchQuery } from '../file-inventory/utils'
import useStyles from '../styles'
import { useBytesConverter as UseBytesConverter } from '../utils'

const FETCH_BATCH_SIZE = 200
const TABLE_NAME = 'dlpFileInventoryList'
const DEFAULT_SORT_BY = `${FILE_INVENTORY_SORT_BY.name}_DESC`

const NameFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const InfoTypeFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<INFO_TYPES[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'infoTypes' })
  return <CheckboxFilter label={label} items={Object.values(INFO_TYPES)} {...props} />
})

type UseFileInventoryListInput = {
  handleRowClick?: any
}

type UseFileInventoryListReturn = {
  tableProps: any
  providerProps: Omit<TableProviderProps, 'children'>
  filterLabelProps: any
}

const idFunction = rowData => rowData?.hash

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useFileInventoryTableProps = ({ handleRowClick }: UseFileInventoryListInput): UseFileInventoryListReturn => {
  const { t } = useTranslation(['dlp/common', 'tables', 'formats', 'general/form'])
  const snackbar = useSnackbar()
  const classes = useStyles()
  const locationState = Hooks.useEventsLocationState()
  const { ...rest } = locationState
  const [tableData, setTableData] = useState([])
  const [urlQueryParams, setUrlQueryParams] = useState({})
  const [fileInventoryQueryVariables, setFileInventoryQueryVariables] = useState({})
  const { canReadDevice, canReadUsers, canReadSettings, canReadPolicyList } = Hooks.useRbacPermissions()
  const location = useLocation()
  const navigate = useNavigate()
  const { search } = location

  const columns = useMemo(
    () => [
      {
        label: t('fileInventory.columns.fileName'),
        dataKey: 'name',
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: (rowData: any) => {
          return rowData['name'].length ? rowData['name'] : t('general/form:commonLabels.unknown')
        },
        renderFilter: () => <NameFilterComponent label={t('fileInventory.filter.fileName')} />,
        width: 500,
      },
      {
        label: t('fileInventory.columns.fileSize'),
        dataKey: 'size',
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any) => {
          return (rowData['size'] && UseBytesConverter(rowData['size'])) || 0
        },
        width: 50,
      },
      {
        label: t('fileInventory.columns.infoTypes'),
        dataKey: 'infoTypes',
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any) => {
          const dataTypes = rowData['infoTypes']?.map(
            infoType => INFO_TYPES[infoType.toUpperCase()] && t(`infoTypesValue.${infoType}`),
          )
          return <span className={classes.dotText}>{dataTypes?.filter(Boolean)?.join(', ')}</span>
        },
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <InfoTypeFilterComponent label={t('fileInventory.filter.infoTypes')} />,
        width: 150,
      },
      {
        label: t('fileInventory.columns.dataTypes'),
        dataKey: 'dataEntitiesCount',
        sortable: true,
        show: true,
        persistent: false,
        hidden: !canReadSettings,
        width: 30,
      },
      {
        label: t('fileInventory.columns.users'),
        dataKey: 'userCount',
        sortable: false,
        show: true,
        persistent: false,
        hidden: !canReadUsers,
        renderCell: (rowData: any) => rowData?.userCount || 0,
        width: 30,
      },
      {
        label: t('fileInventory.columns.devices'),
        dataKey: 'deviceCount',
        sortable: false,
        show: true,
        persistent: false,
        hidden: !canReadDevice,
        renderCell: (rowData: any) => rowData?.deviceCount || 0,
        width: 30,
      },
      {
        label: t('fileInventory.columns.policies'),
        dataKey: 'policiesCount',
        sortable: true,
        show: true,
        persistent: false,
        hidden: !canReadPolicyList,
        width: 30,
      },
      {
        label: 'policyGuid', // is needed for filtering by policyGuid
        dataKey: 'policyGuid',
        show: false,
        filterType: FILTER_TYPES.CHECKBOX,
      },

      {
        label: 'type', // is needed for filtering by type
        dataKey: 'type',
        show: false,
        filterType: FILTER_TYPES.CHECKBOX,
      },
      {
        label: 'dataEntityGuid', // is needed for filtering by dataEntityGuid
        dataKey: 'dataEntityGuid',
        show: false,
        filterType: FILTER_TYPES.CHECKBOX,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })
  const defaultFilters = {}
  const searchParams = new URLSearchParams(search)

  if (Boolean(search) && search.length !== 0) {
    searchParams.get('infoTypes') &&
      (defaultFilters['infoTypes'] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams
          .get('infoTypes')
          .split(',')
          .filter(key => key && key.length > 0),
      })

    searchParams.get('policyGuid') &&
      (defaultFilters['policyGuid'] = {
        operator: OPERATOR_VALUES.EQUAL,
        value: searchParams
          .get('policyGuid')
          .split(',')
          .filter(key => key && key.length > 0),
      })

    searchParams.get('type') &&
      (defaultFilters['type'] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams
          .get('type')
          .split(',')
          .filter(key => key && key.length > 0),
      })

    searchParams.get('dataEntityGuid') &&
      (defaultFilters['dataEntityGuid'] = {
        operator: OPERATOR_VALUES.EQUAL,
        value: searchParams
          .get('dataEntityGuid')
          .split(',')
          .filter(key => key && key.length > 0),
      })
  }

  const filterProps = useFilter(defaultFilters)
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const sortingProps = useSort(null)
  const { sort, sortDirection } = sortingProps

  // Filtering queries in request url
  const filterQuery = useMemo(() => buildFileInventoryListQuery(filterProps.activeFilters), [filterProps.activeFilters])

  useEffect(
    () => {
      setUrlQueryParams({ ...rest, ...filterQuery })
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterQuery],
  )

  const variables = useMemo(
    () => {
      const initialSearchQueryParams = {
        sortBy: sort ? `${FILE_INVENTORY_SORT_BY[sort]}_${sortDirection.toUpperCase()}` : DEFAULT_SORT_BY,
        max: FETCH_BATCH_SIZE,
      }
      const result = !Object.keys(urlQueryParams).length
        ? initialSearchQueryParams
        : { ...initialSearchQueryParams, ...urlQueryParams }
      setFileInventoryQueryVariables(result)
      return result
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [urlQueryParams, sort, sortDirection],
  )

  const variablesRequest = useMemo(
    () => ({ queryParams: fileInventoryQueryVariables }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileInventoryQueryVariables, sort, sortDirection],
  )

  const {
    error: fileInventoryListError,
    loading: fileInventoryListLoading,
    data: fileInventoryListData,
    refetch,
    fetchMore,
  } = useStatefulReduxQuery(FileInventoryData.queryFileInventoryList, { variables: variablesRequest })

  useEffect(() => {
    if (fileInventoryListError && !fileInventoryListLoading) {
      snackbar.enqueueMessage(t('fileInventory.error.listview'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileInventoryListError, fileInventoryListLoading, t])

  useEffect(
    () => {
      if (fileInventoryListData) {
        setTableData([...tableData, ...fileInventoryListData?.elements])
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileInventoryListData],
  )

  useEffect(
    () => {
      if (fileInventoryListData) {
        setTableData([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortingProps.sort, sortingProps.sortDirection, filterQuery],
  )

  useEffect(() => {
    const searchQuery = buildFileInventorySearchQuery(filterProps?.activeFilters, location)
    if (searchQuery.get('infoTypes') !== searchParams.get('infoTypes')) {
      navigate({ search: searchQuery.toString() !== '' ? `?${searchQuery.toString()}` : '' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProps.activeFilters?.infoTypes])

  useEffect(() => {
    if (
      (searchParams.get('policyGuid') && !filterProps.activeFilters?.policyGuid) ||
      (searchParams.get('type') && !filterProps.activeFilters?.type) ||
      (searchParams.get('infoTypes') && !filterProps.activeFilters?.infoTypes) ||
      (searchParams.get('dataEntityGuid') && !filterProps.activeFilters?.dataEntityGuid)
    ) {
      navigate('/file-inventory')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterProps.activeFilters?.policyGuid,
    filterProps.activeFilters?.type,
    filterProps.activeFilters?.infoTypes,
    filterProps.activeFilters?.dataEntityGuid,
  ])

  const onLoadMoreRows = useCallback(
    async () => {
      if (fileInventoryListData?.navigation?.next) {
        const offsetQueryParams = fileInventoryListData?.navigation?.next.match(/offset=(\d+)/)

        await fetchMore({
          queryParams: { ...fileInventoryQueryVariables, offset: Number(offsetQueryParams && offsetQueryParams[1]) },
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileInventoryListData, fetchMore, variables],
  )

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
      filterProps: filterProps,
      loading: fileInventoryListLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const tableProps = {
    rows: tableData ?? [],
    tableName: TABLE_NAME,
    noRowsMessageKey: 'tables:noData',
    onRowClick: handleRowClick,
    onRowsScrollEnd: onLoadMoreRows,
    scrollEndThreshold: 100,
  }

  const providerProps = {
    sortingProps,
    basicProps,
    data: fileInventoryListData?.elements ?? [],
    filterProps,
  }

  return { tableProps, providerProps, filterLabelProps }
}
