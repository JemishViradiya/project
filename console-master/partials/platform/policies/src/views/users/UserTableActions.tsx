/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { Permission, usePermissions } from '@ues-data/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'
import { useTableSelection } from '@ues/behaviours'

import { ResendInvitation } from './resendInvitation/ResendInvitation'

export const UserTableActions = ({ onDelete, onAdd, onResendInvitation }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const { hasPermission } = usePermissions()
  const canCreate = hasPermission(Permission.ECS_USERS_CREATE)
  const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)
  const canDelete = hasPermission(Permission.ECS_USERS_DELETE)

  const selectionProps = useTableSelection()

  return (
    <>
      {selectionProps.selected.length > 0 && (
        <Typography variant="h4">{t('users.grid.selectedCount', { value: selectionProps.selected.length })}</Typography>
      )}
      {canCreate && (
        <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAdd}>
          {t('users.actions.add')}
        </Button>
      )}

      {canUpdate && <ResendInvitation onResendInvitation={onResendInvitation}></ResendInvitation>}

      {selectionProps.selected.length > 0 && canDelete && (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete(selectionProps.selected)}>
          {t('users.actions.delete')}
        </Button>
      )}
    </>
  )
}
