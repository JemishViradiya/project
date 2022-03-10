import React from 'react'

import MenuItem from '@material-ui/core/MenuItem'

import type { SelectProps } from '@ues/behaviours'
import { Select as SelectComponent } from '@ues/behaviours'

import { reallyLongString } from '../utils'
import markdown from './README.md'

const inlineRadioType = 'inline-radio'

export const Select = args => (
  <SelectComponent {...args}>
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value={1}>Item 1</MenuItem>
    <MenuItem value={2}>Item 2</MenuItem>
    <MenuItem value={3}>Item 3</MenuItem>
  </SelectComponent>
)

Select.args = {
  variant: 'filled',
  size: 'small',
  fullWidth: false,
  color: 'primary',
  disabled: false,
  label: 'Select',
  helperText: reallyLongString,
  error: false,
  required: false,
} as SelectProps

export default {
  title: 'Select',
  parameters: {
    notes: { Introduction: markdown },
    'in-dsm': { id: '5f7f00f6262c0f3fc50b1059' },
  },
  argTypes: {
    size: {
      control: {
        type: inlineRadioType,
        options: ['medium', 'small'],
      },
      defaultValue: 'small',
      description: 'Size',
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Full width',
    },
    color: {
      table: {
        disable: true,
      },
      defaultValue: { summary: 'primary' },
    },
    variant: {
      control: {
        type: inlineRadioType,
        options: ['filled', 'outlined', 'standard'],
      },
      defaultValue: { summary: 'filled' },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Error',
    },
    required: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Required',
    },
    helperText: {
      defaultValue: { summary: 'Helper text' },
      description: 'Helper text',
    },
  },
}
