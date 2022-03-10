/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DateFnsUtils from '@date-io/date-fns'

import { FormControl, FormLabel, Typography } from '@material-ui/core'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { I18nFormats } from '@ues/assets'

import makeStyles from './timeStyles'

const INTERVAL_STEP_MIN = 5

const DATE_TIME_TRANSLATIONS = 'platform/time'
export const TimePicker = props => {
  const classes = makeStyles()
  const { t } = useTranslation([DATE_TIME_TRANSLATIONS])
  const [selectedTime, setSelectedTime] = useState(props.selectedTime)
  const onTimeChange = props.onTimeChange
  const { noInputLabel } = props

  const handleTimeChange = time => {
    setSelectedTime(time)
    onTimeChange(time)
  }

  const handleClose = () => {
    console.debug('Handle close')
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        {props.label && (
          <Typography variant="h3" className={classes.timePickerLabel}>
            {props.label}
          </Typography>
        )}
        <KeyboardTimePicker
          size="small"
          margin="normal"
          ampm={t('timePicker.ampm') === 'true'}
          inputVariant="filled"
          minutesStep={INTERVAL_STEP_MIN}
          value={selectedTime}
          onAccept={time => handleTimeChange(time)}
          onClose={handleClose}
          onChange={setSelectedTime}
          okLabel={t('timePicker.okLabel')}
          cancelLabel={t('timePicker.cancelLabel')}
          className={noInputLabel ? 'no-label' : null}
        />
      </>
    </MuiPickersUtilsProvider>
  )
}

export const TimeRange = props => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const classes = makeStyles()
  const [timeRange, setTimeRange] = useState(props.timeRange)
  const { label, onTimeRangeChange, noInputLabel } = props

  const handleFromTimeChange = value => {
    const updatedTimeRange = {
      ...timeRange,
      from: value,
    }
    setTimeRange(updatedTimeRange)
    onTimeRangeChange(updatedTimeRange)
  }

  const handleToTimeChange = value => {
    const updatedTimeRange = {
      ...timeRange,
      to: value,
    }
    setTimeRange(updatedTimeRange)
    onTimeRangeChange(updatedTimeRange)
  }

  return (
    <FormControl id="selectTime" classes={{ root: classes.formControl }}>
      <FormLabel variant="h3" component="label" className={classes.titleLabel}>
        {label}
      </FormLabel>
      <div className={classes.timeRangeWrapper}>
        <TimePicker
          key="timePickerFrom"
          selectedTime={timeRange.from}
          onTimeChange={handleFromTimeChange}
          noInputLabel={noInputLabel}
        />
        <span className={classes.toLabel}>{t('form.to')}</span>
        <TimePicker key="timePickerTo" selectedTime={timeRange.to} onTimeChange={handleToTimeChange} noInputLabel={noInputLabel} />
      </div>
    </FormControl>
  )
}

export const TimeRangeInline = props => {
  const timeRange = props.timeRange
  console.debug(JSON.stringify(timeRange))
  const { t, i18n } = useTranslation([DATE_TIME_TRANSLATIONS])
  return (
    <div>
      {t('timeRange', {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        from: i18n.format(new Date(timeRange.from), I18nFormats.Time),
        to: i18n.format(new Date(timeRange.to), I18nFormats.Time),
      })}
    </div>
  )
}

export const TimeInline = props => {
  const time = props.time
  const { i18n } = useTranslation(['platform/common', 'profiles'])
  return <div>{i18n.format(time, I18nFormats.Time)}</div>
}
