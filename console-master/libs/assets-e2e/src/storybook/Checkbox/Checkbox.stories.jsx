import React from 'react'

import { reallyLongString } from '../utils/strings'
import { CheckboxTemplate as CheckboxStory } from './checkbox.story-templates'
import markdown from './README.md'

const sourceCode = `
import { makeCheckboxHelperTextStyles, useCheckboxLabelStyles } from '@ues/assets'
import { makeStyles, useTheme } from '@material-ui/core'
...

const MyComponent = props => {
  const theme = useTheme()
  const labelClasses = useCheckboxLabelStyles(theme)
  const withLabel = true
  const withHelperText = false

  const HelperText = props => {
    const helperTextClasses = makeStyles({ ...makeCheckboxHelperTextStyles(theme, size) })
    const { withHelperText, helperText } = props
    return withHelperText && <FormHelperText classes={helperTextClasses()}>{helperText}</FormHelperText>
  }
  const handleChange = event => {
    setValue(event.target.value)
  }

  return withLabel || withHelperText ? (
    <FormControl disabled={false} size="small">
      <FormControlLabel
        control={<Checkbox color="primary" onChange={handleChange} value={value} />}
        label={<Typography variant="body2">Checkbox label</Typography>}
        classes={labelClasses}
      />
      {withHelperText && <HelperText {...args}>{helperText}</HelperText>}
    </FormControl>
  ) : (
    <Checkbox color="primary" disabled={false} size="small" onChange={handleChange} value={value} />
  )
}
`
export const Checkbox = args => <CheckboxStory {...args} />
Checkbox.args = {
  withLabel: true,
  color: 'secondary',
  size: 'small',
  disabled: false,
  withHelperText: false,
  indeterminate: false,
  helperText: reallyLongString,
  label: 'Checkbox label',
}

export default {
  title: 'Checkbox',
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f63c4b58e5b2144c3a1c8e9' },
    docs: {
      source: { code: sourceCode },
    },
  },
  argTypes: {
    color: {
      control: {
        type: 'inline-radio',
        options: ['default', 'secondary'],
      },
      defaultValue: {
        summary: 'default',
      },
      description: 'Color',
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ['small', 'medium'],
      },
      defaultValue: { summary: 'small' },
      description: 'Size',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    indeterminate: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: 'false' },
      description: 'Indeterminate',
    },
    withLabel: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: true },
      description: 'With label',
    },
    label: {
      defaultValue: { summary: 'Checkbox label' },
      description: 'Label',
    },

    withHelperText: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With label and helper text',
    },
    helperText: {
      defaultValue: { summary: 'Helper text' },
      description: 'Helper text',
    },
  },
}
