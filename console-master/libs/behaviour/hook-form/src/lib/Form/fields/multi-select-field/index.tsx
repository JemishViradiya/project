//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { forwardRef, useEffect, useState } from 'react'

import type { TextFieldProps } from '@material-ui/core'
import { Box, Chip, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { useFormFieldLayout } from '../../hooks/use-form-field-layout'
import type { BaseFormFieldInputProps, FormFieldOption } from '../../types'
import { FormFieldLayout, FormFieldType } from '../../types'

interface MultiSelectFieldProps extends BaseFormFieldInputProps<string[]> {
  limitTags?: number
  options: FormFieldOption[]
}

const resolveDefaultValue = (value: string[] | undefined, options: FormFieldOption[]) =>
  options?.filter(option => value?.includes(option?.value)) || []

const MultiSelectField: React.FC<MultiSelectFieldProps> = forwardRef(
  (
    { options, value, onChange, label, placeholder, limitTags, disabled, error, helperText, onBlur, required, muiProps, autoFocus },
    ref,
  ) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [multiSelectValue, setMultiSelectValue] = useState<any[]>(resolveDefaultValue(value, options))
    const classes = useFormFieldLayout(FormFieldType.MultiSelect)
    useEffect(() => {
      setMultiSelectValue(resolveDefaultValue(value, options))
    }, [value, options])

    return (
      <Autocomplete
        multiple
        size="small"
        color="primary"
        limitTags={limitTags ?? -1}
        options={options}
        disabled={disabled}
        disableCloseOnSelect
        className={classes?.[FormFieldLayout.EndIcon]}
        getOptionLabel={option => option.label}
        getOptionDisabled={option => option.disabled}
        getOptionSelected={(option, value) => option.value === value.value}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              size="small"
              label={<Typography variant="body2">{option.label}</Typography>}
              {...getTagProps({ index })}
            />
          ))
        }
        onChange={(_, newValue) => {
          onChange(newValue.map(item => item.value))
          setMultiSelectValue(newValue)
        }}
        defaultValue={multiSelectValue}
        value={multiSelectValue}
        renderInput={params => (
          <TextField
            variant="filled"
            fullWidth
            size="small"
            {...params}
            {...(muiProps as TextFieldProps)}
            disabled={disabled}
            className={classes?.[FormFieldLayout.Field]}
            label={<Box className={classes?.[FormFieldLayout.Label]}>{label}</Box>}
            placeholder={placeholder}
            error={error}
            required={required}
            helperText={helperText}
            onBlur={onBlur}
            ref={ref}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
          />
        )}
      />
    )
  },
)

export default MultiSelectField
