import React from 'react'

import type { SwitchProps as MuiSwitchProps } from '@material-ui/core'
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch as MuiSwitch,
  Typography,
  useTheme,
} from '@material-ui/core'

import { useSwitchFormGroupStyles, useSwitchHelperTextStyles, useSwitchLabelStyles } from '@ues/assets'

import { partialAction as action } from '../utils/actions'

interface SwitchProps extends MuiSwitchProps {
  label?: string
  withHelperText?: boolean
}

const LabeledSwitch = (props: SwitchProps) => {
  const theme = useTheme()
  const { label, color, checked } = props
  const classes = useSwitchLabelStyles(theme)

  return (
    <FormControlLabel
      label={<Typography variant="body2">{label}</Typography>}
      classes={classes}
      control={<MuiSwitch defaultChecked color={color} checked={checked} onChange={action('onChange')} name="toggle1" />}
    />
  )
}

const HelperText = props => {
  const theme = useTheme()
  const helperTextClasses = useSwitchHelperTextStyles(theme)
  const { withHelperText, helperText } = props
  return withHelperText && <FormHelperText classes={helperTextClasses}>{helperText}</FormHelperText>
}

export const Switch = (props: SwitchProps) => {
  const theme = useTheme()
  const classes = useSwitchFormGroupStyles(theme)
  const { disabled } = props

  return (
    <FormControl component="fieldset" disabled={disabled}>
      <FormGroup classes={classes}> {LabeledSwitch(props)} </FormGroup>
      {HelperText(props)}
    </FormControl>
  )
}
