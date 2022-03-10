import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { TableCellProps } from '@material-ui/core'
import { Button, IconButton, Link, Paper, Typography } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { mutateDeleteAuthenticator, queryAuthenticators } from '@ues-data/eid'
import { Permission, useErrorCallback, usePermissions, useStatefulAsyncMutation, useStatefulAsyncQuery } from '@ues-data/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'
import {
  BasicTable,
  ConfirmationState,
  ContentArea,
  ContentAreaPanel,
  Loading,
  SecuredContent,
  SecuredContentBoundary,
  TableProvider,
  useConfirmation,
  useSnackbar,
} from '@ues/behaviours'

import makeStyles from './indexstyles'

const idFunction = row => row.id

const isCompleted = (current, previous) => {
  return current && !current.loading && previous.loading
}

const Authenticators = React.memo(() => {
  const { t } = useTranslation(['eid/common'])
  const { hasPermission } = usePermissions()
  const readable: boolean = hasPermission(Permission.ECS_IDENTITY_READ)
  const createable: boolean = hasPermission(Permission.ECS_IDENTITY_CREATE)
  const deleteable: boolean = hasPermission(Permission.ECS_IDENTITY_DELETE)

  const { data, loading, refetch, error } = useStatefulAsyncQuery(queryAuthenticators, { skip: !readable })
  const classes = makeStyles()
  const navigate = useNavigate()
  const { enqueueMessage } = useSnackbar()
  const confirmation = useConfirmation()

  const [deleteAuthenticator, deleteAuthenticatorState] = useStatefulAsyncMutation(mutateDeleteAuthenticator, {})
  const prevDeleteState = usePrevious(deleteAuthenticatorState)

  const onDelete = useCallback(
    async (id, name) => {
      const confirmationState = await confirmation({
        title: t('authenticators.delete'),
        description: t('common.deleteConfirm', { field: name }),
        cancelButtonLabel: t('common.cancel'),
        confirmButtonLabel: t('common.delete'),
        maxWidth: 'xs',
      })
      if (confirmationState === ConfirmationState.Confirmed) {
        deleteAuthenticator({ id: id })
      }
    },
    [confirmation, deleteAuthenticator, t],
  )
  useErrorCallback(error, () => {
    const e: any = error
    enqueueMessage(t('common.failure.read', { reason: e.response?.data?.message }), 'error')
  })

  useEffect(() => {
    if (isCompleted(deleteAuthenticatorState, prevDeleteState)) {
      const e: any = deleteAuthenticatorState.error
      if (e) {
        enqueueMessage(t('common.failure.delete', { reason: e.response?.data?.message }), 'error')
      } else {
        enqueueMessage(t('common.success.delete'), 'success')
        refetch()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteAuthenticatorState])

  const align: TableCellProps['align'] = 'right'
  const columns = useMemo(
    () => [
      {
        dataKey: 'name',
        label: t('common.name'),
        persistent: true,
        width: 400,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return (
            <Link
              onClick={() => {
                navigate(`./${rowData.id}`)
              }}
            >
              {rowData.name}
            </Link>
          )
        },
      },
      {
        dataKey: 'type',
        label: t('common.type'),
        renderCell: (rowData: any, rowDataIndex: number) => {
          return t('authenticators.' + rowData.type)
        },
      },
      {
        dataKey: 'id',
        icon: true,
        align: align,
        renderCell: (rowData: any, rowDataIndex: number) => {
          return deleteable ? (
            <IconButton size="small">
              <BasicDelete
                key={rowData.id}
                className={classes.icon}
                onClick={() => onDelete(rowData.id, rowData.name)}
                aria-label={t('common.delete')}
              />
            </IconButton>
          ) : (
            ''
          )
        },
      },
    ],
    [classes.icon, deleteable, navigate, onDelete, t],
  )

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, loading],
  )
  return (
    <ContentArea>
      <ContentAreaPanel fullWidth title={t('authenticators.title')} ContentWrapper={SecuredContentBoundary}>
        <Typography variant="body2">{t('authenticators.summary')}</Typography>
        <div>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BasicAdd />}
            onClick={() => {
              navigate('./add')
            }}
            disabled={!createable}
          >
            {t('authenticators.add')}
          </Button>
        </div>
        <SecuredContent requiredPermissions={Permission.ECS_IDENTITY_READ}>
          <TableProvider basicProps={basicProps}>
            <BasicTable data={data ?? []} noDataPlaceholder={t('common.nodata')} />
          </TableProvider>
        </SecuredContent>
      </ContentAreaPanel>
    </ContentArea>
  )
})
Authenticators.displayName = 'authenticators'

export default Authenticators
