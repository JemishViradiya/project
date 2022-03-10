//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'

import type { CheckboxProps } from '@material-ui/core'
import { Box, Checkbox, FormControlLabel } from '@material-ui/core'

import { useFormFieldLayout } from '../../hooks/use-form-field-layout'
import type { BaseFormFieldInputProps, FormFieldOption } from '../../types'
import { FormFieldLayout, FormFieldType } from '../../types'

type CheckboxGroupFieldValue = Record<string, boolean>

interface CheckboxGroupFieldProps extends BaseFormFieldInputProps<CheckboxGroupFieldValue> {
  options: FormFieldOption[]
}

const makeDefaultValue = (options: FormFieldOption[]): CheckboxGroupFieldValue =>
  options.reduce((acc, option) => ({ ...acc, [option.value]: false }), {})

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({ options, value, onChange, required, muiProps, disabled }) => {
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<CheckboxGroupFieldValue>(makeDefaultValue(options))
  const classes = useFormFieldLayout(FormFieldType.CheckboxGroup)

  useEffect(() => {
    if (value) {
      setCheckboxGroupValue({ ...checkboxGroupValue, ...value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <>
      {options.map((option, index) => (
        <FormControlLabel
          disabled={option.disabled ?? disabled}
          key={index}
          control={
            <Box className={classes?.[FormFieldLayout.Field]}>
              <Checkbox
                size="small"
                color="secondary"
                {...(muiProps as CheckboxProps)}
                disabled={option.disabled}
                checked={checkboxGroupValue[option.value] ?? null}
                required={required}
                onChange={event => {
                  const update = { ...checkboxGroupValue, [option.value]: event.target.checked }
                  setCheckboxGroupValue(update)
                  onChange(update)
                }}
              />
            </Box>
          }
          label={option.label}
          classes={classes?.[FormFieldLayout.Label]}
        />
      ))}
    </>
  )
}

export default CheckboxGroupField
