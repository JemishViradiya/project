/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { FormControlLabel, Grid, Switch, TextField, Typography, useTheme } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'

import { useStyles } from '../BCNStyles'

const SysLog = props => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const { SETTINGS_MAP, error, handleSwitchChange, handleTextChange, updateable } = props
  const { t } = useTranslation(['platform/common'])
  const data = useSelector(BcnApi.getBcnSettings)

  return (
    <>
      <Grid item xs={12} className={classes.sectionSpacing}>
        <FormControlLabel
          id="sysLogSwitch"
          control={
            <Switch
              checked={data[SETTINGS_MAP.sysLogEnabled] || false}
              onChange={handleSwitchChange}
              id={SETTINGS_MAP.sysLogEnabled}
              aria-labelledby="sysLogSwitch"
              aria-label="sysLogSwitch"
              disabled={!updateable}
            />
          }
          label={<Typography variant="body2">{t('bcn.settings.sysLog')}</Typography>}
        />
      </Grid>
      {data[SETTINGS_MAP.sysLogEnabled] && (
        <>
          <Grid item xs={12} className={classes.nested}>
            <TextField
              id={SETTINGS_MAP.bcpHost}
              required={data[SETTINGS_MAP.sysLogEnabled]}
              disabled={!updateable || !data[SETTINGS_MAP.sysLogEnabled]}
              label={t('bcn.settings.host')}
              margin="normal"
              name={SETTINGS_MAP.bcpHost}
              onChange={handleTextChange}
              value={data[SETTINGS_MAP.bcpHost] || ''}
              size="small"
              width="30ch"
              error={error.host.isError}
              helperText={error.host.isError ? error.host.message : t('bcn.settings.helperText.host')}
            />
          </Grid>
          <Grid item xs={12} className={classes.nested}>
            <TextField
              id={SETTINGS_MAP.bcpPort}
              required={data[SETTINGS_MAP.sysLogEnabled]}
              disabled={!updateable || !data[SETTINGS_MAP.sysLogEnabled]}
              label={t('bcn.settings.port')}
              margin="normal"
              name={SETTINGS_MAP.bcpPort}
              onChange={handleTextChange}
              value={data[SETTINGS_MAP.bcpPort] || ''}
              size="small"
              width="30ch"
              error={error.port.isError}
              helperText={error.port.isError ? error.port.message : t('bcn.settings.helperText.port')}
            />
          </Grid>
        </>
      )}
    </>
  )
}

export default SysLog
