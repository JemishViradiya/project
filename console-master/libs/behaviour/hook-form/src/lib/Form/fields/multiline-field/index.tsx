//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { forwardRef } from 'react'

import type { TextFieldProps } from '@material-ui/core'
import { TextField } from '@material-ui/core'

import { FORM_MULTILINE_FIELD_VALUE_SEPARATOR } from '../../constants'
import { useFormFieldLayout } from '../../hooks/use-form-field-layout'
import type { BaseFormFieldInputProps } from '../../types'
import { FormFieldLayout, FormFieldType } from '../../types'
import { makeMultilineFieldValue } from '../../utils'

const MultilineField: React.FC<BaseFormFieldInputProps<string[]>> = forwardRef(
  ({ value, onChange, label, placeholder, disabled, error, helperText, onBlur, required, muiProps, name, autoFocus }, ref) => {
    const classes = useFormFieldLayout(FormFieldType.MultiLine)

    return (
      <TextField
        {...(muiProps as TextFieldProps)}
        id={name}
        name={name}
        onBlur={onBlur}
        ref={ref}
        multiline
        minRows={5}
        maxRows={8}
        disabled={disabled}
        placeholder={placeholder}
        value={value?.join(FORM_MULTILINE_FIELD_VALUE_SEPARATOR) || ''}
        error={error}
        helperText={helperText}
        className={classes?.[FormFieldLayout.Field]}
        fullWidth
        aria-autocomplete="list"
        type="text"
        size="small"
        label={label}
        required={required}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onChange={({ target }) => {
          if (!target.value) {
            onChange([])
            return
          }
          const extractedValue = makeMultilineFieldValue(target.value)
          onChange(extractedValue)
        }}
      />
    )
  },
)

export default MultilineField
