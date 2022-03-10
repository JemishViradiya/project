//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'

export interface ConfirmationProps {
  open?: boolean
  title: string
  description?: string
  content?: React.ReactNode | string
  cancelButtonLabel?: string
  confirmButtonLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
}

export const ConfirmationDialog: React.FC<ConfirmationProps> = ({
  open = false,
  title,
  description,
  content,
  cancelButtonLabel,
  confirmButtonLabel,
  onCancel,
  onConfirm,
  maxWidth = 'sm',
}) => {
  const prohibitedCloseReason = 'backdropClick'

  const onClose = (event, reason) => {
    if (reason !== prohibitedCloseReason) {
      onCancel()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth aria-labelledby="dialogTitle">
      <DialogTitle disableTypography id="dialogTitle">
        <Typography variant="h2">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        {description && <Typography gutterBottom={!!content}>{description}</Typography>}
        {content}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          {cancelButtonLabel}
        </Button>
        {onConfirm && (
          <Button variant="contained" color="primary" onClick={onConfirm}>
            {confirmButtonLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
