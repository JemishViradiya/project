import React from 'react'

import { reallyLongString } from '../utils/strings'
import markdown from './Radio.md'
import { RadioTemplate as RadioStory } from './radio.story-templates'

const sourceCode = `
import { makeRadioHelperTextStyles, useRadioLabelStyles } from '@ues/assets'
import { makeStyles, useTheme } from '@material-ui/core'
...

const MyComponent = props => {
  const labelClasses = useRadioLabelStyles()
  const withLabel = true
  const withHelperText = false

  const HelperText = props => {
    const helperTextClasses = makeStyles({ ...makeRadioHelperTextStyles(theme, size) })
    const { withHelperText, helperText } = props
    return withHelperText && <FormHelperText classes={helperTextClasses()}>{helperText}</FormHelperText>
  }
  const handleChange = event => {
    setValue(event.target.value)
  }

  return withLabel || withHelperText ? (
    <FormControl disabled={false} size="small">
      <FormControlLabel
        control={<Radio color="secondary" onChange={handleChange} value={value} />}
        label={<Typography variant="body2">Radio label</Typography>}
        classes={labelClasses}
      />
      {withHelperText && <HelperText {...args}>{helperText}</HelperText>}
    </FormControl>
  ) : (
    <Radio color="secondary" disabled={false} size="small" onChange={handleChange} value={value} />
  )
}
`
export const Radio = args => <RadioStory {...args} />

Radio.args = {
  withLabel: true,
  color: 'secondary',
  size: 'small',
  disabled: false,
  withHelperText: false,
  helperText: reallyLongString,
  label: 'Radio label',
}

export default {
  title: 'Radio',
  parameters: {
    notes: markdown,
    'in-dsm': { id: '5f690cae3fb77818bca4de2d' },
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
    withLabel: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: true },
      description: 'With label',
    },
    label: {
      defaultValue: { summary: 'Radio label' },
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
