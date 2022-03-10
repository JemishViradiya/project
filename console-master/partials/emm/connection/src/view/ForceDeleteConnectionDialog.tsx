/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmationDialog } from '@ues/behaviours'

const ForceDeleteConnectionDialog = ({ connectionType, onClose, onConfirmDelete, open = false }) => {
  const { t } = useTranslation(['emm/connection'])

  return (
    <ConfirmationDialog
      open={open}
      onCancel={onClose}
      onConfirm={onConfirmDelete}
      maxWidth="xs"
      key={`deleteDialog_${connectionType}`}
      title={t('emm.page.forceDeleteConnectionDialog.title')}
      cancelButtonLabel={t('button.no')}
      confirmButtonLabel={t('button.yes')}
      content={t('emm.page.forceDeleteConnectionDialog.confirm')}
    />
  )
}

export default ForceDeleteConnectionDialog
