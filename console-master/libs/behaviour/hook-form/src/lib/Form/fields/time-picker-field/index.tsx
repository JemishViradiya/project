//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as React from 'react'
import { useEffect, useState } from 'react'

import type { TimePickerProps } from '@material-ui/pickers'

import { TimePicker } from '@ues/behaviours'

import type { BaseFormFieldInputProps } from '../../types'

export const TimePickerField: React.FC<BaseFormFieldInputProps<Date>> = ({
  disabled,
  error,
  onChange,
  value,
  label,
  required,
  muiProps,
  helperText,
}) => {
  const [timeValue, setTimeValue] = useState<Date>()

  useEffect(() => {
    setTimeValue(value ?? new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTimePickerValueChange = (value: any) => {
    onChange(value)
    setTimeValue(value)
  }

  return (
    <TimePicker
      {...(muiProps as TimePickerProps)}
      value={timeValue}
      label={label}
      onChange={handleTimePickerValueChange}
      required={required}
      error={error}
      disabled={disabled}
      helperText={helperText}
    />
  )
}
