import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { GroupsApi } from '@ues-data/platform'
import { usePrevious, useStatefulApolloQuery, useStatefulReduxMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useFilter, useFilterLabels, useSelected, useSnackbar, useSort } from '@ues/behaviours'

import { resolveFilter } from '../groupsTable/filterResolver'

const idFunction = (rowData: any) => rowData.id
const QUERY_SEPARATOR = ','

export const useUsersTable = ({ groupId, columns, readonly }) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()

  const sortingProps = useSort('displayName', 'asc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const usersVars = useMemo(() => {
    let query = 'isAdminOnly=false'
    Object.entries(filterProps.activeFilters).forEach(filter => {
      if (query !== '') query += QUERY_SEPARATOR
      const key = filter[0]
      query += key + resolveFilter('string', filter[1])
    })
    return { id: groupId, sortBy: `${sort} ${sortDirection?.toUpperCase()}`, query, max: 100, offset: 0 }
  }, [sort, sortDirection, filterProps.activeFilters, groupId])

  const { data, loading, error, refetch, fetchMore } = useStatefulApolloQuery(GroupsApi.queryGroupUsers, {
    variables: usersVars,
    notifyOnNetworkStatusChange: true,
  })

  const selectedProps = useSelected('id')

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
      loading,
    }),
    [columns, loading],
  )

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('groups.usersTable.loadFailure'), 'error')
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
        variables: { offset: startIndex, max: stopIndex - startIndex + 1 },
      }

      await fetchMore(variables)
    },
    [fetchMore],
  )

  const [deleteUsersAction, deleteTask] = useStatefulReduxMutation(GroupsApi.mutationRemoveUsers)
  const prevDeleteTask = usePrevious(deleteTask)

  const handleDelete = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('groups.usersTable.delete.title'),
      description: t('groups.usersTable.delete.message'),
      content: (
        <Box>
          {data?.usersInGroup?.elements
            .filter(d => selectedProps?.selected.includes(d.id))
            .map(g => (
              <Typography variant="h3" key={g['id']}>
                {g['displayName']}
              </Typography>
            ))}
        </Box>
      ),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.remove'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      deleteUsersAction({ id: groupId, users: data?.usersInGroup?.elements.filter(d => selectedProps?.selected.includes(d.id)) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps?.selected])

  useEffect(() => {
    if (GroupsApi.isTaskResolved(deleteTask, prevDeleteTask)) {
      if (deleteTask.error) {
        snackbar.enqueueMessage(t('groups.usersTable.delete.errorMessage'), 'error')
      } else {
        snackbar.enqueueMessage(t('groups.usersTable.delete.successMessage'), 'success')
      }
      selectedProps?.resetSelectedItems()
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTask, prevDeleteTask])

  const infinitLoader = useMemo(
    () => ({
      rowCount: data?.usersInGroup?.totals?.elements ?? 0,
      isRowLoaded: (prop: { index: number }) => data?.usersInGroup?.elements[prop.index] !== undefined ?? false,
      loadMoreRows: onLoadMoreRows,
      threshold: 10,
      minimumBatchSize: 100,
    }),
    [data, onLoadMoreRows],
  )

  return {
    tableProps: { infinitLoader },
    providerProps: {
      basicProps,
      sortingProps,
      filterProps,
      selectedProps: !readonly ? selectedProps : undefined,
      data: data?.usersInGroup?.elements ?? [],
    },
    filterPanelProps: { ...filterProps, ...filterLabelProps },
    onDelete: handleDelete,
    showLoading: deleteTask?.loading,
  }
}
