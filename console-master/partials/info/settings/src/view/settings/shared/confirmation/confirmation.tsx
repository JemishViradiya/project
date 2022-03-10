/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@material-ui/core'

import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import type { ConfirmationProps } from './types'
import { CONFIRMATION_DIALOG_ELEMENT } from './types'

const Confirmation: React.FC<ConfirmationProps> = ({
  confirmationId,
  type,
  onCancel: closeHandler,
  onConfirm,
  title,
  description,
  cancelButton,
  confirmButton,
  base,
  content,
}) => {
  const { t } = useTranslation(['dlp/common'])
  const { open, onClose } = useControlledDialog({
    dialogId: confirmationId,
    onClose: closeHandler,
  })

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogChildren
        title={title ? title : t(getConfirmationDialogLabel(type, CONFIRMATION_DIALOG_ELEMENT.TITLE))}
        onClose={onClose}
        description={description ? description : t(getConfirmationDialogLabel(type, CONFIRMATION_DIALOG_ELEMENT.DESCRIPTION))}
        content={content ? content : null}
        actions={
          <>
            <Button variant="outlined" onClick={onClose}>
              {cancelButton ? cancelButton : t(getConfirmationDialogLabel(type, CONFIRMATION_DIALOG_ELEMENT.CANCEL_BUTTON))}
            </Button>
            <Button color="primary" onClick={onConfirm}>
              {confirmButton ? confirmButton : t(getConfirmationDialogLabel(type, CONFIRMATION_DIALOG_ELEMENT.CONFIRM_BUTTON))}
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export function getConfirmationDialogLabel(type: string, element: string): string {
  return `setting.${type}.${element}`
}

export default Confirmation
