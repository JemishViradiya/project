// //******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { SyntheticEvent } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import type { DialogProps as MuiDialogProps } from '@material-ui/core'
import { DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { useDialogStyles } from '@ues/assets'

export type DialogChildrenProps = {
  title?: string
  description?: string
  onClose?: React.MouseEventHandler
  content?: React.ReactNode
  actions?: React.ReactNode
}

export const DialogChildren = ({ title, content, description, actions, onClose }: DialogChildrenProps): JSX.Element => {
  const dialogClasses = useDialogStyles()
  const { t } = useTranslation(['general/form'])
  return (
    <>
      {title && (
        <DialogTitle disableTypography>
          <Typography variant="h2">{title}</Typography>
          {onClose && (
            <IconButton
              size="small"
              onClick={onClose as React.MouseEventHandler}
              className={dialogClasses.closeButton}
              aria-label={t('general/form:close')}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      {(content || description) && (
        <DialogContent>
          {description && (
            <Typography variant="body2" gutterBottom={!!content}>
              {description}
            </Typography>
          )}
          {content}
        </DialogContent>
      )}
      {actions && <DialogActions>{actions}</DialogActions>}
    </>
  )
}

export type ControlledDialogProps = {
  open: boolean
  onClose: MuiDialogProps['onClose'] & React.EventHandler<SyntheticEvent<unknown>> & (() => unknown)
}
export type UseControlledDialogProps<ID = symbol> = {
  dialogId?: ID
  onClose?: (reason?: string) => unknown
}

export const useControlledDialog = ({ dialogId, onClose, ...rest }: UseControlledDialogProps): ControlledDialogProps => {
  const [open, setOpen] = React.useState<boolean>(() => Boolean(dialogId))

  const handleClose = React.useCallback(
    (event = null, reason = 'user-interaction') => {
      if (event && event.preventDefault) event.preventDefault()
      setOpen(false)
      if (onClose) onClose(reason)
    },
    [onClose],
  )

  React.useEffect(() => {
    setOpen(Boolean(dialogId))
  }, [dialogId])

  return { open, onClose: handleClose }
}
