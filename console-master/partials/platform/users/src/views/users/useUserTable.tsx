import { isEqual } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { evictAggregatedUsersCache, queryAggregatedUsers } from '@ues-data/platform'
import { Permission, usePermissions, usePrevious, useStatefulApolloQuery } from '@ues-data/shared'
import { idsChanged } from '@ues-platform/shared'
import { ColumnPicker, useColumnPicker, useFilter, useServerSideSelection, useSnackbar, useSort } from '@ues/behaviours'

import { buildUsersQuery } from './userUtils'

const idFunction = (rowData: any) => rowData.userId
const TABLE_NAME = 'aggregateUserTable'

export const useUserTable = ({ columns }) => {
  const mounted = React.useRef(true)
  const { hasPermission } = usePermissions()
  const canDelete = hasPermission(Permission.ECS_USERS_DELETE)
  const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)

  const { t } = useTranslation(['platform/common', 'profiles'])
  const snackbar = useSnackbar()
  const [loadingMore, setLoadingMore] = useState(false)

  const sortingProps = useSort('displayName', 'asc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})

  const { onLoadedSelect, countSelected, selectionModel, ...selectedProps } = useServerSideSelection({ idFunction })

  const usersVars = useMemo(() => {
    const query = buildUsersQuery(filterProps.activeFilters)
    return { sortBy: sort, sortDirection: sortDirection, query, max: 50, offset: 0 }
  }, [sort, sortDirection, filterProps.activeFilters])
  const prevUsersVars = usePrevious(usersVars)

  const { data, loading, error, fetchMore, refetch } = useStatefulApolloQuery(queryAggregatedUsers, {
    variables: usersVars,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    returnPartialData: true,
    partialRefetch: true,
  })

  useEffect(() => {
    return () => {
      mounted.current = false
      evictAggregatedUsersCache()
    }
  }, [])

  const prevData = usePrevious(data?.aggregatedUsers?.elements ?? [])
  useEffect(() => {
    const reselectFunc = async data => {
      if (idsChanged(prevData.map(e => idFunction(e)) ?? [], data?.aggregatedUsers?.elements.map(e => idFunction(e)) ?? [])) {
        onLoadedSelect(data?.aggregatedUsers?.elements ?? [], true)
      }
    }
    reselectFunc(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('users.message.error.fetch'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, t])

  const handleOnRowsScrollEnd = useCallback(
    async params => {
      const nextOffset = data?.aggregatedUsers?.elements?.length ?? 0
      if (!data || data?.aggregatedUsers?.elements?.length === data?.aggregatedUsers?.totals?.elements) return

      setLoadingMore(true)
      const moreData = await fetchMore({ variables: { ...usersVars, offset: nextOffset } })
      onLoadedSelect(moreData?.data?.aggregatedUsers?.elements)
      setLoadingMore(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, fetchMore, onLoadedSelect],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('groups.table.columnPickerTitle'),
    tableName: TABLE_NAME,
  })
  columnPickerProps.tableCell = false

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      idFunction,
      loading: loading || loadingMore,
    }),

    [displayedColumns, loading, loadingMore, columnPickerProps],
  )

  const serverSideSelectionModel = useMemo(() => ({ query: usersVars?.query, ...selectionModel }), [usersVars, selectionModel])

  useEffect(() => {
    if (mounted.current && prevUsersVars && !isEqual(prevUsersVars, usersVars)) {
      refetch(usersVars)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersVars])

  return {
    providerProps: { basicProps, sortingProps, filterProps, selectedProps, data: data?.aggregatedUsers?.elements ?? [] },
    filterPanelProps: { ...filterProps },
    tableProps: {
      rows: data?.aggregatedUsers?.elements ?? [],
      onRowsScrollEnd: handleOnRowsScrollEnd,
      checkboxSelection: canDelete || canUpdate,
      tableName: TABLE_NAME,
    },
    totalCount: data?.aggregatedUsers?.totals?.elements ?? 0,
    selectedCount: countSelected(data?.aggregatedUsers?.totals?.elements) ?? 0,
    serverSideSelectionModel,
    refetch: () => refetch(usersVars),
  }
}
