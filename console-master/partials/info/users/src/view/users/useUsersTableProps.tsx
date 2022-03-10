/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import { UsersData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Hooks } from '@ues-info/shared'
import type { TableProviderProps } from '@ues/behaviours'
import { ColumnPicker, useColumnPicker, useFilter, useFilterLabels, useSnackbar, useSort } from '@ues/behaviours'

const TABLE_NAME = 'dlpUsersList'
const QUERY_MAX_VALUE = 25

type UseUsersListInput = {
  handleRowClick?: any
}

type UseUsersListReturn = {
  tableProps: any
  providerProps: Omit<TableProviderProps, 'children'>
  filterLabelProps: any
}

const idFunction = rowData => rowData?.userId

export const useUsersTableProps = ({ handleRowClick }: UseUsersListInput): UseUsersListReturn => {
  const { t } = useTranslation(['dlp/common', 'tables', 'general/form'])
  const snackbar = useSnackbar()
  const locationState = Hooks.useEventsLocationState()
  const { ...rest } = locationState
  const [tableData, setTableData] = useState([])
  const [urlQueryParams, setUrlQueryParams] = useState({})
  const [usersQueryVariables, setUsersQueryVariables] = useState({ max: QUERY_MAX_VALUE })

  const columns = useMemo(
    () => [
      {
        label: t('users.columns.name'),
        dataKey: 'name',
        sortable: true,
        show: true,
        persistent: true,
        renderCell: (rowData: any) => {
          return rowData['name'].length ? (
            <MuiLink component={Link} to={`../users/${rowData?.userId}`}>
              {rowData?.name}
            </MuiLink>
          ) : (
            t('general/form:commonLabels.unknown')
          )
        },
        width: 500,
      },
      {
        label: t('users.columns.emailAddress'),
        dataKey: 'email',
        sortable: true,
        show: true,
        persistent: false,
        width: 50,
      },
      {
        label: t('users.columns.devices'),
        dataKey: 'deviceCount',
        sortable: true,
        show: true,
        persistent: false,
        width: 50,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const sortingProps = useSort(null)
  const { sort, sortDirection } = sortingProps

  // Filtering queries in request url
  const filterQuery = useMemo(() => filterProps.activeFilters, [filterProps.activeFilters])

  useEffect(
    () => {
      setUrlQueryParams({ ...rest, ...filterQuery })
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterQuery],
  )

  const variablesRequest = useMemo(
    () => ({ queryParams: usersQueryVariables }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usersQueryVariables, sort, sortDirection],
  )

  const {
    error: usersListError,
    loading: usersListLoading,
    data: usersListData,
    refetch,
    fetchMore,
  } = useStatefulReduxQuery(UsersData.queryUsersList, { variables: variablesRequest })

  useEffect(() => {
    if (usersListError && !usersListLoading) {
      snackbar.enqueueMessage(t('users.error.listView'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersListError, usersListLoading, t])

  useEffect(
    () => {
      if (usersListData) {
        setTableData([...tableData, ...usersListData?.elements])
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [usersListData],
  )

  useEffect(
    () => {
      if (usersListData) {
        setTableData([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortingProps.sort, sortingProps.sortDirection, filterQuery],
  )

  const onLoadMoreRows = useCallback(
    async () => {
      if (usersListData?.navigation?.next) {
        const searchParams = new URL(usersListData?.navigation?.next).searchParams
        const offset = searchParams.get('offset')
        await fetchMore({
          queryParams: { ...usersQueryVariables, offset: Number(offset) },
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usersListData, fetchMore],
  )

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
      filterProps: filterProps,
      loading: usersListLoading,
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
    data: usersListData?.elements ?? [],
    filterProps,
  }

  return { tableProps, providerProps, filterLabelProps }
}
