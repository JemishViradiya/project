/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContentText } from '@material-ui/core'

import { ConfirmationDialog } from '@ues/behaviours'

const DeleteConnectionDialog = ({ connectionType, onClose, onConfirmDelete, open = false }) => {
  const { t } = useTranslation(['emm/connection'])

  return (
    <ConfirmationDialog
      open={open}
      onCancel={onClose}
      onConfirm={onConfirmDelete}
      aria-labelledby="removeEmmConnectionTitle"
      aria-describedby="deleteConnectionDialogDescription"
      maxWidth="xs"
      key={`deleteDialog_${connectionType}`}
      title={t('emm.page.removeConnection')}
      cancelButtonLabel={t('button.cancel')}
      confirmButtonLabel={t('button.delete')}
      content={
        <DialogContentText id="deleteConnectionDialogDescription" component="div" variant="body2">
          {t('emm.page.deleteConnectionDialog.confirm')}
          <p />
        </DialogContentText>
      }
    />
  )
}

export default DeleteConnectionDialog
