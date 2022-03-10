import React from 'react'

import { reallyLongString } from '../utils/strings'
import markdown from './Toggle.md'
import { Switch as ToggleStory } from './toggle.story-templates'

const sourceCode = `
import { useSwitchFormGroupStyles, useSwitchHelperTextStyles, useSwitchLabelStyles } from '@ues/assets'
import { useTheme } from '@material-ui/core'
...
const MyToggle = () => {
  const color = 'default'
  const disabled = false
  const theme = useTheme()
  const labelClasses = useSwitchLabelStyles(theme)
  const helperTextClasses = useSwitchHelperTextStyles(theme)
  const formGroupClasses = useSwitchFormGroupStyles(theme)
  const [checked, setChecked] = React.useState(false)

  return (
    <FormControl disabled={disabled} component="fieldset">
      <FormGroup classes={formGroupClasses}>
        <FormControlLabel
          control={
            <Switch color={color} checked={checked} onChange={() => setChecked(!checked)} name="toggle1" />
          }
          label={<Typography variant="body2">Switch</Typography>}
          classes={labelClasses}
        />
      </FormGroup>
      <FormHelperText classes={helperTextClasses}>
        Helper text
      </FormHelperText>
    </FormControl>
  )
}`

export const Toggle = args => <ToggleStory {...args} />
Toggle.args = {
  color: 'secondary',
  disabled: false,
  withHelperText: false,
  label: 'Switch',
  helperText: reallyLongString,
}

export default {
  title: 'Toggle (Switch)',
  component: Toggle,
  parameters: {
    docs: {
      source: {
        code: sourceCode,
      },
    },
    notes: markdown,
    'in-dsm': {
      id: '5f8ef99eefcba83f78ac5e47',
    },
  },
  argTypes: {
    color: {
      table: {
        disable: true,
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Disabled',
    },
    withHelperText: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With label and helper text',
    },
    label: {
      defaultValue: { summary: 'Switch' },
      description: 'Label',
    },
    helperText: {
      defaultValue: { summary: 'Helper text' },
      description: 'Helper text',
    },
  },
}
