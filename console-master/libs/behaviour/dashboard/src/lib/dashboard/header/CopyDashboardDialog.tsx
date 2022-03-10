/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, Dialog, TextField } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

import { selectState } from '../store'
import { useAddDashboard } from './../hooks/useAddDashboard'

type CopyDashboardDialogProps = {
  open: boolean
  onClose: () => void
}

export const CopyDashboardDialog = memo(({ open, onClose }: CopyDashboardDialogProps) => {
  const { t } = useTranslation(['dashboard', 'general/form'])

  const currentDashboard = useSelector(selectState)
  const { addDashboard, validationError, helperText, resetErrors } = useAddDashboard({ onClose })

  const copyDashboard = useCallback(
    title => {
      addDashboard({ ...currentDashboard, title: title })
    },
    [addDashboard, currentDashboard],
  )

  const formProps = {
    component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
    onSubmit: useCallback(
      event => {
        event.preventDefault()
        event.stopPropagation()
        let formElements = [...event.target.elements]
        if (formElements.length === 1) formElements = Array.from(formElements[0]) // Storybook returns elements inside HTMLFormControlsCollection
        const formData = formElements.reduce((agg, item) => (item.id ? Object.assign(agg, { [item.id]: item.value }) : agg), {})
        copyDashboard(formData.dashboardTitle)
      },
      [copyDashboard],
    ),
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'xs'}
      PaperProps={formProps}
      open={open}
      TransitionProps={{ onExit: resetErrors }}
      onClose={onClose}
    >
      <DialogChildren
        title={t('duplicateDashboard')}
        onClose={onClose}
        description={t('copyDashboardDescription')}
        content={
          <TextField
            required
            fullWidth
            id="dashboardTitle"
            label={t('dashboardTitle')}
            variant={'filled'}
            size="small"
            error={validationError}
            helperText={helperText}
            onChange={resetErrors}
          />
        }
        actions={
          <>
            <Button variant="outlined" onClick={onClose}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {t('general/form:commonLabels.save')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
})
