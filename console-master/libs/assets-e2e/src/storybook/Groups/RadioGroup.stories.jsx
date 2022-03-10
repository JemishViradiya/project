import React, { useState } from 'react'

import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Radio, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { makeRadioHelperTextStyles, useRadioLabelStyles } from '@ues/assets'

import { randomString } from '../utils/strings'
import markdown from './RadioGroup.md'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(1),
  },
}))

export const RadioGroup = args => {
  const classes = useStyles()
  const theme = useTheme()
  const helperTextClasses = makeStyles({ ...makeRadioHelperTextStyles(theme, args.size) })()
  const labelClasses = useRadioLabelStyles(theme)
  const radioButtons = Array.from(new Array(args.radioButtons).keys())

  const [selectedRadio, setSelectedRadio] = useState(-1)
  const handleSelectRadio = (event, idx) => {
    setSelectedRadio(idx)
  }

  return (
    <div className={classes.root}>
      <FormControl
        component="fieldset"
        color={args.color}
        className={classes.formControl}
        disabled={args.disabled}
        error={args.error}
      >
        <FormLabel component="label" variant="h3">
          Radio group
        </FormLabel>
        {args.error && <FormHelperText>Error message for the radio group </FormHelperText>}
        <FormGroup>
          {radioButtons.map(index => (
            <FormControl disabled={args.disabled || args.disabledRadioIndex === index + 1}>
              <FormControlLabel
                control={
                  <Radio
                    size={args.size}
                    color={args.color}
                    name={'radio' + index}
                    onClick={e => handleSelectRadio(e, index)}
                    checked={selectedRadio === index}
                  />
                }
                label={<Typography variant="body2">{`Radio ${index + 1}`}</Typography>}
                disabled={args.disabled || args.disabledRadioIndex === index + 1}
                id={index}
                classes={labelClasses}
              />
              {args.withHelperText && <FormHelperText classes={helperTextClasses}>{randomString(index)}</FormHelperText>}
            </FormControl>
          ))}
        </FormGroup>
      </FormControl>
    </div>
  )
}

RadioGroup.args = {
  size: 'small',
  color: 'secondary',
  radioButtons: 3,
  disabled: false,
  disabledRadioIndex: 2,
  error: false,
}

export default {
  title: 'Groups/RadioGroup',
  component: RadioGroup,
  parameters: {
    notes: { Introduction: markdown },
    'in-dsm': { id: '???' },
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
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'Error state',
    },
    withHelperText: {
      control: {
        type: 'boolean',
      },
      defaultValue: { summary: false },
      description: 'With label and helper text',
    },
  },

  radioButtons: {
    control: {
      type: 'number',
      min: 1,
    },
    defaultValue: { summary: 3 },
    description: 'Number of radioButtons',
  },
  disabledRadioIndex: {
    control: {
      type: 'number',
      min: 1,
    },
    defaultValue: { summary: 2 },
    description: 'The index of the disabled radio',
  },
}
