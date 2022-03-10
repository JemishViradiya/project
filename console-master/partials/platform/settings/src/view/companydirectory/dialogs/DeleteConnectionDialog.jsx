/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContentText } from '@material-ui/core'

import { ConfirmationDialog } from '@ues/behaviours'

const DeleteConnectionDialog = props => {
  const { connectionId, connectionName, onClose, onConfirmDelete, open = false } = props
  const { t } = useTranslation(['platform/common', 'general/form'])

  return (
    <ConfirmationDialog
      open={open}
      onCancel={onClose}
      onConfirm={onConfirmDelete}
      aria-labelledby="removeDirectoryConnectionTitle"
      aria-describedby="deleteConnectionDialogDescription"
      key={`deleteDialog_${connectionId}`}
      title={t('directory.removeConnection')}
      cancelButtonLabel={t('general/form:commonLabels.cancel')}
      confirmButtonLabel={t('general/form:commonLabels.delete')}
      content={
        <DialogContentText id="deleteConnectionDialogDescription" component="div" variant="body2">
          {t('directory.deleteConnectionDialog.confirm', {
            connectionName: connectionName,
          })}
          <p />
          {t('directory.deleteConnectionDialog.deleteNote')}
        </DialogContentText>
      }
    />
  )
}

export default DeleteConnectionDialog
