/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cn from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { FormControlLabel, Grid, Switch, TextField, Typography, useTheme } from '@material-ui/core'

import { BcnApi } from '@ues-data/platform'
import { useInputFormControlStyles } from '@ues/assets'

import { useStyles } from '../BCNStyles'

const LogFile = props => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const { root } = useInputFormControlStyles(theme)
  const { SETTINGS_MAP, error, handleSwitchChange, handleTextChange, updateable } = props

  const { t } = useTranslation(['platform/common'])
  const data = useSelector(BcnApi.getBcnSettings)

  return (
    <>
      <Grid item xs={12} className={classes.sectionSpacing}>
        <FormControlLabel
          id="logFileSwitch"
          control={
            <Switch
              checked={data[SETTINGS_MAP.loggingFileEnabled] || false}
              onChange={handleSwitchChange}
              id={SETTINGS_MAP.loggingFileEnabled}
              aria-labelledby="logFileSwitch"
              aria-label="logFileSwitch"
              disabled={!updateable}
            />
          }
          label={<Typography variant="body2">{t('bcn.settings.enableLocalFileDestination')}</Typography>}
        />
      </Grid>
      {data[SETTINGS_MAP.loggingFileEnabled] && (
        <>
          <Grid item xs={12} className={classes.nested}>
            <TextField
              id={SETTINGS_MAP.maximumSizeMb}
              required={data[SETTINGS_MAP.loggingFileEnabled]}
              disabled={!updateable || !data[SETTINGS_MAP.loggingFileEnabled]}
              label={t('bcn.settings.maximumLogFileSize')}
              margin="normal"
              name="maximumLogFileSize"
              aria-label="maximumLogFileSize"
              onChange={handleTextChange}
              value={data[SETTINGS_MAP.maximumSizeMb] || ''}
              classes={{ root }}
              size="small"
              width="30ch"
              error={error.maximumLogFileSize.isError}
              helperText={
                error.maximumLogFileSize.isError
                  ? error.maximumLogFileSize.message
                  : t('bcn.settings.helperText.maximumLogFileSize')
              }
            />
          </Grid>
          <Grid item xs={12} className={classes.nested}>
            <TextField
              id={SETTINGS_MAP.maximumAgeDays}
              required={data[SETTINGS_MAP.loggingFileEnabled]}
              disabled={!updateable || !data[SETTINGS_MAP.loggingFileEnabled]}
              label={t('bcn.settings.maximumServerLogFileAge')}
              margin="normal"
              name="maximumServerLogFileAge"
              aria-label="maximumServerLogFileAge"
              onChange={handleTextChange}
              value={data[SETTINGS_MAP.maximumAgeDays] || ''}
              classes={{ root }}
              size="small"
              width="30ch"
              error={error.maximumServerLogFileAge.isError}
              helperText={
                error.maximumServerLogFileAge.isError
                  ? error.maximumServerLogFileAge.message
                  : t('bcn.settings.helperText.maximumServerLogFileAge')
              }
            />
          </Grid>
          <Grid item xs={12} className={cn(classes.nested, classes.sectionSpacing)}>
            <FormControlLabel
              id="fileCompressionSwitch"
              control={
                <Switch
                  disabled={!updateable || !data[SETTINGS_MAP.loggingFileEnabled]}
                  checked={data[SETTINGS_MAP.fileCompressionEnabled] || false}
                  onChange={handleSwitchChange}
                  id={SETTINGS_MAP.fileCompressionEnabled}
                  aria-labelledby="fileCompressionSwitch"
                  aria-label="fileCompressionSwitch"
                />
              }
              label={<Typography variant="body2">{t('bcn.settings.enableLoggingFolderCompression')}</Typography>}
            />
          </Grid>
        </>
      )}
    </>
  )
}

export default LogFile
