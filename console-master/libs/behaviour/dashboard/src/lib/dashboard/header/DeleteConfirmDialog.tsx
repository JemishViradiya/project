/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, Typography } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

type DeleteConfirmDialogProps = {
  open: boolean
  onClose: () => void
  handleDelete: () => void
}

export const DeleteConfirmDialog = memo(({ open, onClose, handleDelete }: DeleteConfirmDialogProps) => {
  const { t } = useTranslation(['dashboard', 'general/form'])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      event.stopPropagation()
      handleDelete()
    },
    [handleDelete],
  )

  return useMemo(() => {
    const formProps = {
      component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
      onSubmit: handleSubmit,
    }
    return (
      <Dialog PaperProps={formProps} open={open} onClose={onClose}>
        <DialogChildren
          title={t('deleteDashboard')}
          onClose={onClose}
          content={<Typography variant="body2">{t('deleteDashboardConfirm')}</Typography>}
          actions={
            <>
              <Button variant="outlined" onClick={onClose}>
                {t('general/form:commonLabels.cancel')}
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {t('general/form:commonLabels.ok')}
              </Button>
            </>
          }
        />
      </Dialog>
    )
  }, [handleSubmit, onClose, open, t])
})
