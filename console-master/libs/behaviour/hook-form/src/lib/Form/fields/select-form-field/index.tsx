//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import type { SelectProps } from '@material-ui/core'
import { MenuItem } from '@material-ui/core'

import { Select } from '@ues/behaviours'

import { useFormFieldLayout } from '../../hooks/use-form-field-layout'
import type { BaseFormFieldInputProps, FormFieldOption } from '../../types'
import { FormFieldLayout, FormFieldType } from '../../types'

interface SelectFormFieldProps extends BaseFormFieldInputProps {
  name?: string
  options: FormFieldOption[]
}

export const SelectFormField: React.FC<SelectFormFieldProps> = ({
  muiProps,
  error,
  label,
  onChange,
  helperText,
  name,
  options,
  required,
  disabled,
  value,
  autoFocus,
}) => {
  const classes = useFormFieldLayout(FormFieldType.Select)

  return (
    <Select
      {...(muiProps as SelectProps)}
      id={name}
      labelId="1"
      value={value}
      name={name}
      error={error}
      label={label}
      disabled={disabled}
      required={required}
      helperText={helperText as string}
      className={classes?.[FormFieldLayout.Field]}
      onChange={event => onChange(event.target.value)}
      children={options?.map(option => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
      variant="filled"
      size="small"
      color="primary"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
    />
  )
}
