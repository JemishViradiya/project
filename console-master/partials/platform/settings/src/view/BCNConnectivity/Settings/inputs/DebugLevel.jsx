/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Grid, MenuItem } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'
import { Select } from '@ues/behaviours'

const DEBUG_LEVELS = {
  ERROR: 'bcn.settings.debugLevels.error',
  WARN: 'bcn.settings.debugLevels.warn',
  INFO: 'bcn.settings.debugLevels.info',
  DEBUG: 'bcn.settings.debugLevels.debug',
  TRACE: 'bcn.settings.debugLevels.trace',
}

const DebugLevel = props => {
  const { SETTINGS_MAP, updateable } = props
  const { t } = useTranslation(['platform/common'])
  const data = useSelector(BcnApi.getBcnSettings)
  const dispatch = useDispatch()
  const debugLevelsInput = Object.keys(DEBUG_LEVELS).map(x => ({
    id: x,
    label: t(DEBUG_LEVELS[x]),
  }))

  const handleChange = event => {
    dispatch(BcnApi.setLocalBcnSettings({ ...data, [SETTINGS_MAP.debugLevel]: event.target.value }))
  }

  const selectProps = {
    variant: 'filled',
    size: 'small',
    color: 'primary',
    disabled: false,
    label: 'Server debug levels',
    required: true,
    onChange: handleChange,
  }

  return (
    <Grid item xs={12}>
      <Select {...selectProps} disabled={!updateable} value={data['common.logging.level'] || 'ERROR'}>
        {debugLevelsInput.map(x => (
          <MenuItem key={x.id} value={x.id}>
            {x.label}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  )
}

export default DebugLevel
