/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, FormControlLabel, Switch, TextField, Typography } from '@material-ui/core'

import {
  ENABLE_OFFBOARDING_KEY,
  ENABLE_ONBOARDING_KEY,
  FORCE_SYNC_KEY,
  NESTING_LEVEL_KEY,
  OFFBOARDING_PROTECTION_KEY,
  SYNC_LEVEL_KEY,
  syncSettingsMap,
} from '@ues-data/platform'
import { ContentAreaPanel } from '@ues/behaviours'

import { useDirectoryPermissions } from './directoryHooks'
import makeStyles from './SyncSettingsStyles'
import type { DirectorySyncSettings, Error } from './types'

const MIN_LIMIT = 0
const MAX_LIMIT = 65534
const MIN_NESTING_LEVEL = -1
const MAX_NESTING_LEVEL = 65534

const defaultErrors = {
  [SYNC_LEVEL_KEY]: { isError: false, message: '' },
  [NESTING_LEVEL_KEY]: { isError: false, message: '' },
}

const defaultSettings: DirectorySyncSettings = {
  syncForce: syncSettingsMap[FORCE_SYNC_KEY].default,
  syncEnableOffboarding: syncSettingsMap[ENABLE_OFFBOARDING_KEY].default,
  syncMaxNesting: syncSettingsMap[NESTING_LEVEL_KEY].default,
  syncEnableOnboarding: syncSettingsMap[ENABLE_ONBOARDING_KEY].default,
  syncMaxChanges: syncSettingsMap[SYNC_LEVEL_KEY].default,
  syncEnableOffboardingProtection: syncSettingsMap[OFFBOARDING_PROTECTION_KEY].default,
}

interface SyncSettingsProps {
  syncSettings: DirectorySyncSettings
  onSettingsUpdate: (syncSettings: DirectorySyncSettings) => void
  disableSubmitButton: (disable: boolean) => void
}

export const SyncSettings = memo(({ onSettingsUpdate, syncSettings, disableSubmitButton }: SyncSettingsProps) => {
  const classes = makeStyles()
  const { canUpdate } = useDirectoryPermissions()
  const { t } = useTranslation(['platform/common', 'platform/validation'])
  const [errors, setErrors] = useState(defaultErrors)

  useEffect(() => {
    checkValidation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  const checkValidation = () => {
    const err: Error[] = Object.values(errors).filter(x => x.isError)
    disableSubmitButton(err.length > 0)
  }

  const handleCheckboxChange = (event, key) => {
    const checked = event.target.checked
    let newState
    if (key === ENABLE_ONBOARDING_KEY && !checked) {
      // Top level switch is off, reset everything to defaults
      newState = Object.assign({}, defaultSettings)
    } else if (key === ENABLE_OFFBOARDING_KEY && !checked) {
      newState = {
        ...syncSettings,
        [key]: event.target.checked,
        [OFFBOARDING_PROTECTION_KEY]: false,
      }
    } else {
      newState = {
        ...syncSettings,
        [key]: event.target.checked,
      }
    }

    onSettingsUpdate(newState)
  }

  const validateInput = (value, elementKey, min, max) => {
    let hasError = false
    let message = ''
    if (typeof value === 'undefined' || value.trim().length === 0) {
      hasError = true
      message = t('platform/validation:emptyField', {
        fieldName: t(syncSettingsMap[elementKey].label),
      })
    } else if (value < min || value > max) {
      hasError = true
      message = t('platform/validation:outOfRange', { min: min, max: max })
    }

    setErrors({
      ...errors,
      [elementKey]: { isError: hasError, message: message },
    })
  }

  const handleSyncLimitChange = ({ target }) => {
    const { value, name } = target
    const newState = Object.assign({}, syncSettings)
    newState[name] = parseInt(value)

    onSettingsUpdate(newState)
    validateInput(value, name, MIN_LIMIT, MAX_LIMIT)
  }

  const handleChangeSyncNestingLevel = ({ target }) => {
    const { value, name } = target
    const newState = Object.assign({}, syncSettings)
    newState[name] = parseInt(value)

    onSettingsUpdate(newState)
    validateInput(value, name, MIN_NESTING_LEVEL, MAX_NESTING_LEVEL)
  }

  const renderOnboarding = () => {
    return (
      <Box className={classes.nested}>
        <Box>
          <TextField
            id={SYNC_LEVEL_KEY}
            required
            label={t(syncSettingsMap[SYNC_LEVEL_KEY].label)}
            margin="normal"
            name={SYNC_LEVEL_KEY}
            onChange={handleSyncLimitChange}
            value={syncSettings[SYNC_LEVEL_KEY]}
            size="small"
            type="number"
            error={errors[SYNC_LEVEL_KEY].isError}
            helperText={
              errors[SYNC_LEVEL_KEY].isError ? errors[SYNC_LEVEL_KEY].message : t(syncSettingsMap[SYNC_LEVEL_KEY].helpText)
            }
            classes={{ root: classes.numericInput }}
            className={classes.syncInput}
            disabled={!canUpdate}
          />
        </Box>
        <Box>
          <TextField
            id={NESTING_LEVEL_KEY}
            required
            label={t(syncSettingsMap[NESTING_LEVEL_KEY].label)}
            margin="normal"
            name={NESTING_LEVEL_KEY}
            onChange={handleChangeSyncNestingLevel}
            value={syncSettings[NESTING_LEVEL_KEY]}
            size="small"
            type="number"
            error={errors[NESTING_LEVEL_KEY].isError}
            helperText={
              errors[NESTING_LEVEL_KEY].isError
                ? errors[NESTING_LEVEL_KEY].message
                : t('directory.syncSettings.nestingLevelDescription')
            }
            classes={{ root: classes.numericInput }}
            disabled={!canUpdate}
          />
        </Box>
        <Box className={classes.fieldSpacing}>
          <FormControlLabel
            label={<Typography variant="body2">{t(`${syncSettingsMap[FORCE_SYNC_KEY].label}`)}</Typography>}
            control={
              <Switch
                checked={syncSettings[FORCE_SYNC_KEY]}
                name="forceSync"
                onChange={e => handleCheckboxChange(e, FORCE_SYNC_KEY)}
                disabled={!canUpdate}
              />
            }
            disabled={!canUpdate}
          />
        </Box>
        <Box className={classes.sectionSpacing}>
          <Typography variant="h3" gutterBottom>
            {t('directory.syncSettings.offboardingTitle')}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom>
            {t('directory.syncSettings.offboardingDescriptionDetail')}
          </Typography>
        </Box>
        <Box>
          <FormControlLabel
            label={<Typography variant="body2">{t(`${syncSettingsMap[ENABLE_OFFBOARDING_KEY].label}`)}</Typography>}
            control={
              <Switch
                checked={syncSettings[ENABLE_OFFBOARDING_KEY]}
                name="enableOffboarding"
                onChange={e => handleCheckboxChange(e, ENABLE_OFFBOARDING_KEY)}
              />
            }
            disabled={!canUpdate}
          />
        </Box>
        {syncSettings[ENABLE_OFFBOARDING_KEY] && (
          <Box className={classes.nested}>
            <FormControlLabel
              label={<Typography variant="body2">{t(`${syncSettingsMap[OFFBOARDING_PROTECTION_KEY].label}`)}</Typography>}
              control={
                <Switch
                  checked={syncSettings[OFFBOARDING_PROTECTION_KEY]}
                  name="offboardingProtection"
                  onChange={e => handleCheckboxChange(e, OFFBOARDING_PROTECTION_KEY)}
                />
              }
              disabled={!canUpdate}
            />
          </Box>
        )}
      </Box>
    )
  }

  return (
    <ContentAreaPanel title={t('directory.syncSettings.onboardingTitle')}>
      <Typography variant="body2" gutterBottom>
        {t('directory.syncSettings.description')}
      </Typography>
      <FormControlLabel
        label={<Typography variant="body2">{t(`${syncSettingsMap[ENABLE_ONBOARDING_KEY].label}`)}</Typography>}
        control={
          <Switch
            checked={syncSettings[ENABLE_ONBOARDING_KEY]}
            name="onboarding"
            onChange={e => handleCheckboxChange(e, ENABLE_ONBOARDING_KEY)}
            disabled={!canUpdate}
          />
        }
      />

      {syncSettings[ENABLE_ONBOARDING_KEY] && renderOnboarding()}
    </ContentAreaPanel>
  )
})

export default SyncSettings
