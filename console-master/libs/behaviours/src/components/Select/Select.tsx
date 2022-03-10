import cn from 'clsx'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import type { SelectProps as MuiSelectProps } from '@material-ui/core/Select'
import MuiSelect from '@material-ui/core/Select'
import { useTheme } from '@material-ui/core/styles'

import { defaultSelectProps, useDefaultFormControlStyles } from '@ues/assets'

interface SelectProps extends MuiSelectProps {
  labelId?: string
  wrapperClassName?: string
  size?: 'small' | 'medium'
  helperText?: string
}

const Select = ({
  size,
  helperText,
  className,
  wrapperClassName,
  label,
  labelId,
  disabled,
  required,
  variant,
  error,
  children,
  ...props
}: SelectProps) => {
  const theme = useTheme()
  const classes = useDefaultFormControlStyles(theme)
  return (
    <FormControl
      className={wrapperClassName}
      size={size}
      disabled={disabled}
      required={required}
      variant={variant}
      classes={classes}
      error={error}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        {...(label && { labelId, label })}
        className={cn(className, { 'no-label': !label })}
        {...defaultSelectProps}
        {...props}
      >
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export { Select, SelectProps }
