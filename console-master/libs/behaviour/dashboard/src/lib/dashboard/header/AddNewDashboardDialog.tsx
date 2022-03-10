/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, makeStyles, MenuItem, TextField } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'

import { useServiceEnabled } from '@ues-data/shared'
import type { ServiceId } from '@ues-data/shared-types'
import { DialogChildren, Select } from '@ues/behaviours'

import type { DashboardProps } from '../types'
import { useAddDashboard } from './../hooks/useAddDashboard'

const useStyles = makeStyles(theme => ({
  select: {
    marginBottom: 0,
  },
}))

type AddNewDashboardDialogProps = {
  open: boolean
  onClose: () => void
  outOfBoxConfigs?: DashboardProps[]
}

const NEW_DASHBOARD = 'NEW_EMPTY_DASHBOARD_VALUE'

export const AddNewDashboardDialog = memo(({ open, onClose, outOfBoxConfigs = [] }: AddNewDashboardDialogProps) => {
  const styles = useStyles()
  const { t } = useTranslation(['dashboard', 'general/form', 'navigation'])

  const [newDashboard, setNewDashboard] = useState(NEW_DASHBOARD)

  const { addDashboard, addEmptyDashboard, validationError, helperText, resetErrors } = useAddDashboard({ onClose })

  const addNewDashboard = useCallback(
    formData => {
      if (formData.newDashboard === NEW_DASHBOARD) {
        addEmptyDashboard(formData.title)
      } else {
        const oobDashInfo = outOfBoxConfigs.find(oob => {
          return oob.id === formData.newDashboard
        })
        addDashboard({ ...oobDashInfo, title: formData.title })
      }
    },
    [addDashboard, addEmptyDashboard, outOfBoxConfigs],
  )

  const { isEnabled } = useServiceEnabled()
  const filteredConfigs = outOfBoxConfigs.filter(config => {
    const services = config.requiredServices
    if (!services || services.length === 0) return true
    return services.every(s => isEnabled(s as ServiceId))
  })

  const formProps = {
    component: 'form' as React.ElementType<React.HTMLAttributes<HTMLElement>>,
    onSubmit: useCallback(
      event => {
        event.preventDefault()
        event.stopPropagation()
        let formElements = [...event.target.elements]
        if (formElements.length === 1) formElements = Array.from(formElements[0]) // Storybook returns elements inside HTMLFormControlsCollection
        const formData = formElements.reduce((agg, item) => (item.id ? Object.assign(agg, { [item.id]: item.value }) : agg), {})
        addNewDashboard(formData)
      },
      [addNewDashboard],
    ),
  }

  const handleChange = event => {
    resetErrors()
    setNewDashboard(event.target.value)
  }

  function content() {
    return (
      <>
        <FormControl fullWidth variant="outlined" className={styles.select}>
          <Select
            displayEmpty={false}
            fullWidth
            onChange={handleChange}
            value={newDashboard}
            label={''}
            size="small"
            variant="filled"
            inputProps={{ id: 'newDashboard' }}
          >
            <MenuItem key={NEW_DASHBOARD} value={NEW_DASHBOARD}>
              {t('newDashboard')}
            </MenuItem>
            {filteredConfigs.map(({ id, title }) => {
              return (
                <MenuItem key={id} value={id}>
                  {t(`navigation:${id}`)}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <TextField
          required
          fullWidth
          id="title"
          label={t('dashboardTitle')}
          variant={'filled'}
          size="small"
          error={validationError}
          helperText={helperText}
          onChange={resetErrors}
        />
      </>
    )
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'xs'}
      PaperProps={formProps}
      TransitionProps={{ onExit: resetErrors }}
      open={open}
      onClose={onClose}
    >
      <DialogChildren
        title={t('addNewDashboard')}
        onClose={onClose}
        description={t('addNewDashboardDescription')}
        content={content()}
        actions={
          <>
            <Button variant="outlined" onClick={onClose}>
              {t('general/form:commonLabels.cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {t('general/form:commonLabels.add')}
            </Button>
          </>
        }
      />
    </Dialog>
  )
})
