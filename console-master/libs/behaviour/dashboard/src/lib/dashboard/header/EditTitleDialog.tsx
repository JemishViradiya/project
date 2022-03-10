/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Button, Dialog, TextField } from '@material-ui/core'

import { updateDashboardTitleMutation } from '@ues-data/dashboard'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { DialogChildren } from '@ues/behaviours'

import { updateDashboardTitleUI } from '../store'

type EditTitleDialogProps = {
  dashboardId: string
  open: boolean
  onClose: () => void
  onEditSuccess: () => void
}

export const EditTitleDialog = memo(({ dashboardId, open, onClose, onEditSuccess }: EditTitleDialogProps) => {
  const { t } = useTranslation(['dashboard', 'general/form'])
  const [validationError, setValidationError] = useState(false)
  const [helperText, setHelperText] = useState('')
  const dispatch = useDispatch()

  const resetErrors = () => {
    setValidationError(false)
    setHelperText('')
  }

  const onEditError = useCallback(
    error => {
      if (error.graphQLErrors) {
        for (const err of error.graphQLErrors) {
          if (err.extensions.code === 'BAD_USER_INPUT') {
            setValidationError(true)
            setHelperText(t('duplicateTitleError'))
          } else {
            console.error(err.message)
          }
        }
      }
    },
    [t],
  )

  const [
    updateTitleFn,
    { loading: updating, data: updateComplete, error },
  ] = useStatefulApolloMutation(updateDashboardTitleMutation, { variables: { dashboardId: '' } })

  const updateTitle = useCallback(
    title => {
      updateTitleFn({
        variables: {
          dashboardId,
          title,
        },
      })
    },
    [dashboardId, updateTitleFn],
  )

  useEffect(() => {
    if (!updating && updateComplete) {
      onEditSuccess()
      dispatch(updateDashboardTitleUI(updateComplete['updateDashboardTitle']))
    } else if (error) {
      onEditError(error)
    }
  }, [dispatch, error, onEditError, onEditSuccess, updateComplete, updating])

  const formProps = {
    component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
    onSubmit: useCallback(
      event => {
        event.preventDefault()
        event.stopPropagation()
        let formElements = [...event.target.elements]
        if (formElements.length === 1) formElements = Array.from(formElements[0]) // Storybook returns elements inside HTMLFormControlsCollection
        const formData = formElements.reduce((agg, item) => (item.id ? Object.assign(agg, { [item.id]: item.value }) : agg), {})
        const title = formData.editTitle?.trim()
        if (typeof title != 'undefined' && title) {
          updateTitle(title)
        } else {
          setValidationError(true)
          setHelperText(t('emptyTitleError'))
        }
      },
      [t, updateTitle],
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
        title={t('editTitle')}
        onClose={onClose}
        content={
          <TextField
            required
            fullWidth
            id="editTitle"
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
