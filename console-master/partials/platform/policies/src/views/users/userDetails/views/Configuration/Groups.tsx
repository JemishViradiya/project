/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Box, Button, Card, CardHeader, IconButton, Typography } from '@material-ui/core'

import { UsersApi } from '@ues-data/platform'
import { Permission, usePermissions, usePrevious, useStatefulAsyncQuery } from '@ues-data/shared'
import { SearchDialog } from '@ues-platform/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'
import type { TableSortDirection } from '@ues/behaviours'
import { BasicTable, TableProvider, TableToolbar, useClientSort, useSnackbar, useSort } from '@ues/behaviours'

import { isCompleted } from '../../../userUtils'
import { useGroupAssignDialog, useGroupUnassign, usePolicySync } from './groupsHooks'

const idFunction = row => row.id

const Groups = props => {
  const { enqueueMessage } = useSnackbar()
  const { t } = useTranslation(['platform/common'])
  const { userData, refetchPoliciesRef } = props
  const { id: userId } = useParams()
  const { hasPermission } = usePermissions()
  const editable: boolean = hasPermission(Permission.ECS_USERS_UPDATE)

  const userGroupsVars = useMemo(() => ({ userId }), [userId])

  const groupsState = useStatefulAsyncQuery(UsersApi.queryUserGroups, { variables: userGroupsVars, skip: !userId })
  const { data: userGroups, loading: loadingGroups, refetch } = groupsState
  const prevGroupsState = usePrevious(groupsState)

  const { handleDelete } = useGroupUnassign(userId, userData?.displayName, refetch)
  const { dialogProps, openAddDialog } = useGroupAssignDialog(userId, userGroups, refetch)
  const { syncPolicies, cancelSync } = usePolicySync(refetchPoliciesRef)

  useEffect(() => {
    return () => cancelSync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialLoad = useRef(true)

  useEffect(() => {
    if (isCompleted(groupsState, prevGroupsState)) {
      if (groupsState.error) {
        enqueueMessage(t('users.details.configuration.groups.errors.fetchUser'), 'error')
      } else {
        if (initialLoad.current) {
          initialLoad.current = false
        } else {
          // Do not refresh assignments on first load
          syncPolicies()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsState, prevGroupsState])

  const COLUMNS = useMemo(
    () => [
      {
        dataKey: 'name',
        label: t('users.details.configuration.groups.userGroupName'),
        sortable: true,
      },
      {
        dataKey: 'type',
        label: t('users.details.configuration.groups.type'),
        renderCell: (rowData: any) => {
          return rowData.isDirectoryGroup
            ? t('users.details.configuration.groups.directoryGroup')
            : t('users.details.configuration.groups.localGroup')
        },
      },
      {
        dataKey: 'action',
        renderCell: (rowData: any, rowDataIndex: number) => {
          return !rowData.isDirectoryGroup && editable ? (
            <IconButton size="small" onClick={() => handleDelete(rowData)}>
              <BasicDelete />
            </IconButton>
          ) : null
        },
        renderLabel: () => null,
        styles: { width: 30 },
        icon: true,
      },
    ],
    [editable, handleDelete, t],
  )

  const sortingProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortingProps
  const sortedData = useClientSort({
    data: userGroups,
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  const basicProps = useMemo(
    () => ({
      columns: COLUMNS,
      idFunction,
      loading: loadingGroups,
    }),
    [COLUMNS, loadingGroups],
  )

  return (
    <>
      <SearchDialog {...dialogProps} />
      <Card variant="outlined">
        <CardHeader title={<Typography variant="h2">{t('users.details.configuration.groups.title')}</Typography>} />
        {editable && (
          <Box mb={6}>
            <Typography>{t('users.details.configuration.groups.description')}</Typography>
          </Box>
        )}
        <TableProvider basicProps={basicProps} sortingProps={sortingProps}>
          {editable && (
            <TableToolbar
              begin={
                <Button
                  startIcon={<BasicAdd />}
                  onClick={openAddDialog}
                  disabled={loadingGroups}
                  variant="contained"
                  color="secondary"
                >
                  {t('users.details.configuration.groups.assignButton')}
                </Button>
              }
            />
          )}
          <BasicTable data={sortedData ?? []} noDataPlaceholder={t('noData')} />
        </TableProvider>
      </Card>
    </>
  )
}

export default Groups
