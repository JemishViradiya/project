import React from 'react'

import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { makeCheckboxHelperTextStyles, useCheckboxLabelStyles } from '@ues/assets'

import { randomString } from '../utils/strings'
import markdown from './CheckboxGroup.md'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(1),
  },
}))

export const CheckboxGroup = args => {
  const classes = useStyles()
  const theme = useTheme()
  const helperTextClasses = makeStyles({ ...makeCheckboxHelperTextStyles(theme, args.size) })()
  const labelClasses = useCheckboxLabelStyles(theme)
  const checkboxes = Array.from(new Array(args.checkboxes).keys())

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
          Checkbox group
        </FormLabel>
        {args.error && <FormHelperText>Error message for the checkbox group</FormHelperText>}
        <FormGroup>
          {checkboxes.map(index => (
            <FormControl disabled={args.disabled || args.disabledCheckboxIndex === index + 1}>
              <FormControlLabel
                control={<Checkbox size={args.size} color={args.color} name={'checkbox' + index} defaultChecked />}
                label={<Typography variant="body2">{`Checkbox ${index + 1}`}</Typography>}
                disabled={args.disabled || args.disabledCheckboxIndex === index + 1}
                id={index}
                classes={labelClasses}
              />
              {args.withHelperText && (
                <FormHelperText classes={helperTextClasses}>{randomString(index)}</FormHelperText>
                //<FormHelperText classes={helperTextClasses}>{'Helper text for checkbox ' + (index + 1)}</FormHelperText>
              )}
            </FormControl>
          ))}
        </FormGroup>
      </FormControl>
    </div>
  )
}

CheckboxGroup.args = {
  size: 'small',
  color: 'secondary',
  checkboxes: 3,
  disabled: false,
  disabledCheckboxIndex: 2,
  error: false,
}

export default {
  title: 'Groups/CheckboxGroup',
  component: CheckboxGroup,
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

  checkboxes: {
    control: {
      type: 'number',
      min: 1,
    },
    defaultValue: { summary: 3 },
    description: 'Number of checkboxes',
  },
  disabledCheckboxIndex: {
    control: {
      type: 'number',
      min: 1,
    },
    defaultValue: { summary: 2 },
    description: 'The index of the disabled checkbox',
  },
}
