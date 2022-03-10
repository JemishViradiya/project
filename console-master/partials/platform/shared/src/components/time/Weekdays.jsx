/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Radio, RadioGroup } from '@material-ui/core'

import makeStyles from './WeekdaysStyles'

export const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const transform = weekDayArray => {
  return WEEK_DAYS.reduce((obj, x) => {
    obj[x] = weekDayArray.filter(y => y === x).length === 1
    return obj
  }, {})
}

export const Weekdays = props => {
  // console.debug('Weekday values: ' + JSON.stringify(props))
  const classes = makeStyles()
  const { t } = useTranslation(['platform/time', 'platform/validation'])
  const [state, setState] = useState(transform(props.values))
  const error = props.error ? props.error : { isError: false, message: '' }

  const handleChange = event => {
    // console.debug('Selected checkbox: ' + event.target.name + ': ' + event.target.checked)
    const updatedState = { ...state, [event.target.name]: event.target.checked }
    setState(updatedState)
    const selectedDays = Object.entries(updatedState).filter(entry => entry[1])
    props.onDaySelected(selectedDays.map(x => x[0]))
  }

  return (
    <div className={classes.root}>
      <FormControl required error={error.isError} component="fieldset" classes={{ root: classes.marginBottomNone }}>
        <FormLabel component="label" variant="h3" classes={{ root: classes.label }}>
          {props.label}
        </FormLabel>
        <FormGroup>
          {Object.entries(state).map(([id, checked]) => (
            <FormControlLabel control={<Checkbox checked={state[id]} onChange={handleChange} name={id} />} label={t(id)} key={id} />
          ))}
        </FormGroup>
        {error.isError && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </div>
  )
}

export const WeekdaysRadio = props => {
  const classes = makeStyles()
  const { t } = useTranslation(['platform/time'])
  const [value, setValue] = useState('monday')

  const handleChange = event => {
    setValue(event.target.value)
    // console.debug('Selected: ' + event.target.value)
    props.onDaySelected(event.target.value)
  }
  return (
    <div className={classes.root}>
      <FormControl required component="fieldset" {...props}>
        <FormLabel component="label" classes={{ root: classes.label }}>
          {props.label}
        </FormLabel>
        <RadioGroup aria-label="weekDayRadioGroup" name="weekDay" value={value} onChange={handleChange}>
          {WEEK_DAYS.map(id => (
            <FormControlLabel value={id} control={<Radio />} label={t(id)} key={id} />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  )
}
