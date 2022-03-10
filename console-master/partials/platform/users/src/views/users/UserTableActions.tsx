/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Typography } from '@material-ui/core'

import { Permission, usePermissions } from '@ues-data/shared'
import { BasicAdd, BasicDelete } from '@ues/assets'

import { ResendInvitation } from './resendInvitation/ResendInvitation'

export const UserTableActions = ({ onDelete, onAdd, onResendInvitation, onExpirePasscodes, selectedCount }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])

  const { hasPermission } = usePermissions()
  const canCreate = hasPermission(Permission.ECS_USERS_CREATE)
  const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)
  const canDelete = hasPermission(Permission.ECS_USERS_DELETE)

  return (
    <>
      {selectedCount > 0 && <Typography variant="h4">{t('users.grid.selectedCount', { value: selectedCount })}</Typography>}
      {canCreate && (
        <Button startIcon={<BasicAdd />} variant="contained" color="secondary" onClick={onAdd}>
          {t('users.actions.add')}
        </Button>
      )}

      {selectedCount > 0 && canUpdate && <ResendInvitation onResendInvitation={onResendInvitation}></ResendInvitation>}

      {selectedCount > 0 && canDelete && (
        <Button startIcon={<BasicDelete />} variant="contained" color="primary" onClick={() => onDelete()}>
          {t('users.actions.delete')}
        </Button>
      )}

      {selectedCount > 0 && canUpdate && (
        <Button variant="contained" color="primary" onClick={() => onExpirePasscodes()}>
          {t('users.actions.expirePasscode')}
        </Button>
      )}
    </>
  )
}
