/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, DialogActions, FormControl, FormLabel, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import type { DirectoryInstanceSyncSchedule } from '@ues-data/platform'
import { DAILY, INTERVAL, intervals, isEqualIntervalType, ONCE, syncTypes, USERS_AND_GROUPS } from '@ues-data/platform'
import { InputSelect, TimePicker, TimeRange, WEEK_DAYS, Weekdays, WeekdaysRadio } from '@ues-platform/shared'
import { DialogChildren } from '@ues/behaviours'

import makeStyles from './AddScheduleDialogStyles'
import type { ExtendedSyncSchedule } from './types'

const MIN_INTERVAL = 15
const MAX_INTERVAL = 1440
const DEFAULT_INTERVAL_MIN = 30

const getDefaultDateTime = () => {
  const dt = new Date()
  dt.setHours(0)
  dt.setMinutes(0)
  dt.setSeconds(0)
  dt.setMilliseconds(0)
  return dt
}

interface AddScheduleDialogProps {
  onClose: (schedule: DirectoryInstanceSyncSchedule) => void
  onCancel: () => void
  open: boolean
  schedules: DirectoryInstanceSyncSchedule[]
}
const AddScheduleDialog = memo(({ onClose, onCancel, open, schedules }: AddScheduleDialogProps) => {
  const classes = makeStyles()

  const { t } = useTranslation(['platform/common', 'platform/time', 'platform/validation', 'general/form'])
  const syncTypesInput = Object.keys(syncTypes).map(x => ({
    id: x,
    label: t(syncTypes[x]),
  }))
  const intervalsInput = Object.keys(intervals).map(x => ({
    id: x,
    label: t(intervals[x]),
  }))
  const defaultSchedule: ExtendedSyncSchedule = {
    type: USERS_AND_GROUPS,
    iterations: INTERVAL,
    callbackFreq: DEFAULT_INTERVAL_MIN,
    startTimeOfDay: getDefaultDateTime(),
    endTimeOfDay: getDefaultDateTime(),
    selectedDays: WEEK_DAYS,
    selectedDay: WEEK_DAYS[0],
    new: true,
  }
  const [schedule, setSchedule] = useState<ExtendedSyncSchedule>({ ...defaultSchedule, id: Date.now() })
  const hasDuplicates = newState => {
    let i = 0
    let duplicateFound = false
    for (i = 0; i < schedules.length && !duplicateFound; i++) {
      const curSchedule: ExtendedSyncSchedule = schedules[i]
      if (curSchedule.iterations === newState.iterations) {
        duplicateFound = isEqualIntervalType(curSchedule.iterations, curSchedule, newState)
      }
    }
    duplicateFound && console.debug(' DUPLICATE FOUND!')
    return {
      isError: duplicateFound,
      message: duplicateFound ? t('directory.error.duplicateSchedule') : '',
    }
  }

  const [displayWeekdays, setDisplayWeekdays] = useState(true)
  const [error, setError] = useState({
    callbackFreq: { isError: false, message: '' },
    selectedDays: { isError: false, message: '' },
    hasDuplicates: { ...hasDuplicates(schedule) },
  })

  const handleClose = () => {
    onCancel()
  }

  const checkForDuplicates = newState => {
    const hasDupes = hasDuplicates(newState)
    setError(prevState => ({
      ...prevState,
      hasDuplicates: { ...hasDupes },
    }))
    return hasDupes
  }

  const handleSave = event => {
    console.debug('SAVE: ')
    printSchedule()
    onClose(schedule)
  }

  const handleSelectType = value => {
    const newState = { ...schedule, type: value }
    checkForDuplicates(newState)
    setSchedule(newState)
  }

  // For debugging
  const printSchedule = () => {
    //    console.debug('Connection:' + JSON.stringify(connection) + ',Schedule: ' + JSON.stringify(schedule))
  }

  const handleSelectIntervalType = value => {
    const newState = { ...schedule, iterations: value }
    checkForDuplicates(newState)
    setSchedule(newState)
    setDisplayWeekdays(value === INTERVAL || value === DAILY)
  }

  const intervalLabel = t('directory.syncSchedule.interval.interval')
  const validateInterval = interval => {
    let result = true
    const fieldName = intervalLabel

    if (typeof interval === 'undefined' || interval.length === 0) {
      setError(prevState => ({
        ...prevState,
        callbackFreq: {
          isError: true,
          message: t('platform/validation:emptyField', {
            fieldName: fieldName,
          }),
        },
      }))
      result = false
    } else if (isNaN(interval)) {
      setError(prevState => ({
        ...prevState,
        callbackFreq: {
          isError: true,
          message: t('platform/validation:invalidField', {
            fieldName: fieldName,
          }),
        },
      }))
      result = false
    } else if (interval < MIN_INTERVAL || interval > MAX_INTERVAL) {
      setError(prevState => ({
        ...prevState,
        callbackFreq: {
          isError: true,
          message: t('platform/validation:outOfRange', {
            min: MIN_INTERVAL,
            max: MAX_INTERVAL,
          }),
        },
      }))
      result = false
    } else {
      setError(prevState => ({
        ...prevState,
        callbackFreq: { isError: false, message: '' },
      }))
    }
    return result
  }

  const handleChangeIntervalValue = event => {
    const value = parseInt(event.target.value)
    validateInterval(value)

    const newState = { ...schedule, callbackFreq: value }
    checkForDuplicates(newState)
    setSchedule(newState)
  }

  const handleTimeRangeChange = timeRange => {
    const newState = {
      ...schedule,
      startTimeOfDay: timeRange.from,
      endTimeOfDay: timeRange.to,
    }
    checkForDuplicates(newState)
    setSchedule(newState)
  }

  const handleSelectedDay = value => {
    const newState = { ...schedule, selectedDay: value }
    checkForDuplicates(newState)
    setSchedule(newState)
  }

  const handleSelectedDays = value => {
    const newState = { ...schedule, selectedDays: value }
    checkForDuplicates(newState)
    setSchedule(newState)

    setError(prevState => ({
      ...prevState,
      selectedDays: {
        isError: value.length === 0,
        message: value.length === 0 && t('platform/validation:selectAtLeastOneValue'),
      },
    }))
  }

  const renderInterval = () => {
    const timeRange = {
      from: schedule.startTimeOfDay,
      to: schedule.endTimeOfDay,
    }

    return (
      <>
        <TextField
          id="callbackFreq"
          required
          label={intervalLabel}
          size="small"
          margin="normal"
          name="callbackFreq"
          onChange={handleChangeIntervalValue}
          value={schedule.callbackFreq}
          type="number"
          error={error.callbackFreq.isError}
          helperText={error.callbackFreq.message}
          classes={{ root: classes.numericInput }}
        />

        <div className={classes.sectionSpacer}>
          <TimeRange
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            label={t('directory.syncSchedule.syncBetween')}
            noInputLabel
          />
        </div>
      </>
    )
  }

  const renderNoRecurrence = () => {
    return (
      <div className={classes.sectionSpacer}>
        {renderTimePicker()}
        <WeekdaysRadio
          label={t('directory.syncSchedule.scheduledDay')}
          onDaySelected={handleSelectedDay}
          values={schedule.selectedDay}
          errors={error.selectedDays}
          className={`${classes.sectionSpacer} ${classes.noMarginBottom}`}
        />
      </div>
    )
  }

  const handleFromTimeChange = time => {
    // console.debug('Handle time change ' + JSON.stringify(time))
    const newState = {
      ...schedule,
      startTimeOfDay: time,
    }

    checkForDuplicates(newState)
    setSchedule(newState)
  }

  const renderTimePicker = () => {
    return (
      <div className={classes.sectionSpacer}>
        <FormControl id="selectTime" classes={{ root: classes.noMarginBottom }}>
          <FormLabel component="label">{t('directory.syncSchedule.setTime')}</FormLabel>
          <TimePicker key="fromTime" onTimeChange={handleFromTimeChange} selectedTime={schedule.startTimeOfDay} noInputLabel />
        </FormControl>
      </div>
    )
  }
  const renderOnceADay = () => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <div className={classes.sectionSpacer}>{renderTimePicker()}</div>
  }

  const showIntervalTypeSelection = () => {
    switch (schedule.iterations) {
      case INTERVAL:
        return renderInterval()
      case DAILY:
        return renderOnceADay()
      case ONCE:
        return renderNoRecurrence()
      default:
        return ''
    }
  }

  const renderContent = () => {
    return (
      <>
        {error.hasDuplicates.isError && (
          <Alert severity="error" variant="outlined" className={classes.alert}>
            {error.hasDuplicates.message}
          </Alert>
        )}
        <InputSelect
          values={syncTypesInput}
          size="small"
          name="selectSyncType"
          id="selectSyncType"
          setInputValue={handleSelectType}
          defaultValue={schedule.type}
          inputLabel={t('directory.syncSchedule.type')}
          required
        />
        <InputSelect
          values={intervalsInput}
          size="small"
          name="selectInterval"
          id="selectInterval"
          setInputValue={handleSelectIntervalType}
          defaultValue={schedule.iterations}
          inputLabel={t('directory.syncSchedule.recurrence')}
          required
        />

        {showIntervalTypeSelection()}
        {displayWeekdays && (
          <div className={classes.sectionSpacer}>
            <Weekdays
              onDaySelected={handleSelectedDays}
              label={t('directory.syncSchedule.scheduledDays')}
              values={schedule.selectedDays}
              error={error.selectedDays}
            />
          </div>
        )}
      </>
    )
  }

  const isSubmitButtonDisabled = () => {
    let errors = []
    switch (schedule.iterations) {
      case DAILY:
        errors = Object.entries(error).filter(x => x[0] === 'selectedDays')
        //      console.debug('Errors DAILY:' + JSON.stringify(errors))
        break
      case INTERVAL:
        errors = Object.entries(error)
        //        console.debug('Errors INTERVAL:' + JSON.stringify(errors))
        break
      default:
        errors = []
    }
    // console.debug('Errors:' + JSON.stringify(errors))
    return errors.map(x => x[1].isError).filter(x => x).length > 0
  }

  return (
    <Dialog
      id="addSyncScheduleDialogTitle"
      open={open}
      fullWidth
      maxWidth="sm"
      aria-labelledby="addSyncScheduleDialogTitle"
      classes={{ paper: classes.paper }}
    >
      <DialogChildren title={t('directory.syncSchedule.add')} content={renderContent()} onClose={onCancel} />

      <DialogActions classes={{ root: classes.dialogActions }}>
        <Button variant="outlined" onClick={e => handleClose()}>
          {t('general/form:commonLabels.cancel')}
        </Button>
        <Button disabled={isSubmitButtonDisabled()} onClick={e => handleSave(e)} color="primary" variant="contained">
          {t('general/form:commonLabels.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default AddScheduleDialog
