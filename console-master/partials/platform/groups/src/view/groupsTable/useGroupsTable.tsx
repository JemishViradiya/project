import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { GroupsApi } from '@ues-data/platform'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { ColumnPicker, useColumnPicker, useFilter, useFilterLabels, useSelected, useSnackbar, useSort } from '@ues/behaviours'

import { useGroupPermissions } from '../common/useGroupPermissions'
import { buildGroupQuery } from './filterResolver'
import { useGroupDelete } from './useGroupDelete'

const idFunction = (rowData: any) => rowData.id

export const useGroupsTable = ({ columns }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()

  const sortingProps = useSort('name', 'asc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const groupsVars = useMemo(() => {
    const query = buildGroupQuery(filterProps)
    return { sortBy: `${sort} ${sortDirection?.toUpperCase()}`, query, max: 200 }
  }, [sort, sortDirection, filterProps])

  const { data, loading, error, refetch, fetchMore } = useStatefulApolloQuery(GroupsApi.queryGroups, {
    variables: groupsVars,
    notifyOnNetworkStatusChange: true,
  })

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: t('groups.table.columnPickerTitle') })
  const selectedProps = useSelected('id')
  const { canDelete } = useGroupPermissions()

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      idFunction,
      loading,
    }),

    [displayedColumns, columnPickerProps, loading],
  )

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('groups.table.groupLoadFailure'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, t])

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortDirection, filterProps.activeFilters])

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.userGroups?.cursor, max: stopIndex - startIndex + 1 },
      }

      await fetchMore(variables)
    },
    [fetchMore, data?.userGroups?.cursor],
  )

  const infinitLoader = useMemo(
    () => ({
      rowCount: data?.userGroups?.totals?.elements ?? 0,
      isRowLoaded: (prop: { index: number }) => data?.userGroups?.elements[prop.index] !== undefined ?? false,
      loadMoreRows: onLoadMoreRows,
      threshold: 10,
      minimumBatchSize: 30,
    }),
    [data, onLoadMoreRows],
  )

  const { onDelete, deleteLoading } = useGroupDelete({ selectedProps, refetch, groupsElements: data?.userGroups?.elements })

  return {
    tableProps: { infinitLoader },
    providerProps: {
      basicProps,
      sortingProps,
      filterProps,
      selectedProps: canDelete ? selectedProps : undefined,
      data: data?.userGroups?.elements ?? [],
    },
    filterPanelProps: { ...filterProps, ...filterLabelProps },
    onDelete,
    showLoading: deleteLoading,
  }
}
