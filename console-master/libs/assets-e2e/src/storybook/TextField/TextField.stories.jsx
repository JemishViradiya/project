import { isEmpty } from 'lodash-es'
import React, { useState } from 'react'

import { IconButton, MenuItem, TextField as MuiTextField, useTheme } from '@material-ui/core'

import {
  BasicCancel,
  BasicVisibilityOff,
  BasicVisibilityOn,
  rightAlignedInputHelperTextProps,
  useInputFormControlStyles,
} from '@ues/assets'

import { reallyLongString } from '../utils/strings'
import markdown from './TextFields.md'

const inlineRadioType = 'inline-radio'

const cats = ['Calico', 'Tabby', 'Ragdoll', 'Persian']

const TextFieldStory = ({
  variant,
  error,
  color,
  size,
  fullWidth,
  required,
  label,
  helperText,
  disabled,
  readonly,
  passwordWithIcon,
  helperTextAlignment,
  type,
  placeholder,
}) => {
  const theme = useTheme()

  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { root, iconButton } = useInputFormControlStyles(theme)
  const hasPasswordIcon = type === 'password' && passwordWithIcon
  let typeProps = { type: type }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleClearSearch = () => {
    setValue('')
  }
  const inputProps = {}
  if (readonly) inputProps.readOnly = readonly
  if (hasPasswordIcon) {
    inputProps.endAdornment = (
      <IconButton
        disabled={disabled}
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        classes={{ root: iconButton }}
      >
        {showPassword ? <BasicVisibilityOff /> : <BasicVisibilityOn />}
      </IconButton>
    )
    if (showPassword) typeProps.type = 'text'
  } else {
    if (type === 'search') {
      if (!isEmpty(value) && !readonly) {
        inputProps.endAdornment = (
          <IconButton
            disabled={disabled}
            classes={{ root: iconButton }}
            aria-label="clear search text"
            onClick={handleClearSearch}
            onMouseDown={handleMouseDownPassword}
          >
            <BasicCancel />
          </IconButton>
        )
      }
      typeProps = { type: 'text' }
    }
  }

  let formHelperTextProps = {}
  if (helperTextAlignment === 'right') {
    formHelperTextProps = { ...rightAlignedInputHelperTextProps }
  }
  if (type === 'select') {
    formHelperTextProps.select = true
    formHelperTextProps.children = cats.map(option => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))
  }
  let labelProp = {}
  if (label) {
    labelProp = { label: label }
  } else {
    labelProp = { className: 'no-label' }
  }

  return (
    <MuiTextField
      id="text-field"
      InputProps={inputProps}
      required={required}
      error={error}
      disabled={disabled}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      color={color}
      helperText={helperText}
      classes={{ root: root }}
      {...labelProp}
      value={value}
      {...typeProps}
      {...formHelperTextProps}
      onChange={event => setValue(event.target.value)}
      placeholder={placeholder}
    />
  )
}
export const TextField = args => <TextFieldStory {...args} />
TextField.args = {
  variant: 'filled',
  size: 'small',
  fullWidth: false,
  color: 'primary',
  disabled: false,
  label: 'Label',
  helperText: reallyLongString,
  error: false,
  required: false,
  readonly: false,
  passwordWithIcon: false,
  type: 'text',
  helperTextAlignment: 'left',
  placeholder: 'Default value',
}

export default {
  title: 'TextField',
  component: TextFieldStory,
  parameters: {
    notes: { Introduction: markdown },
    'in-dsm': { id: '5f75dde19ca8b7a40e56259a' },
  },
  argTypes: {
    variant: {
      control: {
        type: inlineRadioType,
        options: ['filled', 'outlined', 'standard'],
      },
      defaultValue: { summary: 'filled' },
    },
    size: {
      control: {
        type: inlineRadioType,
        options: ['medium', 'small'],
      },
      defaultValue: { summary: 'small' },
      description: 'Size',
    },
    type: {
      control: {
        type: 'select',
        options: [
          // core types
          'text',
          'number',
          'search',
          'password',
          'select',
          // extended types
          // 'button',
          // 'checkbox',
          // 'color',
          // 'date',
          // 'datetime-local',
          // 'email',
          // 'file',
          // 'month',
          // 'range',
          // 'reset',
          // 'submit',
          // 'tel',
          // 'time',
          // 'url',
          // 'week',
        ],
      },
      defaultValue: { summary: 'text' },
      description: 'Field type',
    },
    passwordWithIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: `Password with icon (only relevant for 'password' field type)`,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    readonly: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Read only',
    },
    required: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Required',
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Error',
    },
    helperTextAlignment: {
      control: {
        type: 'inline-radio',
        options: ['left', 'right'],
      },
      defaultValue: {
        summary: 'left',
      },
      description: 'Helper text alignment',
    },
    color: {
      table: {
        disable: true,
      },
      defaultValue: { summary: 'primary' },
    },
    helperText: {
      description: 'Helper text',
    },
  },
}
