import { omit } from 'lodash-es'
import React, { useState } from 'react'

import type { RadioProps as MuiRadioProps } from '@material-ui/core'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  Radio as MuiRadio,
  Typography,
  useTheme,
} from '@material-ui/core'

import { makeRadioHelperTextStyles, useRadioLabelStyles } from '@ues/assets'

export interface RadioProps extends MuiRadioProps {
  withLabel?: boolean
  withHelperText?: boolean
  label?: string
  helperText?: string
}

export const RadioTemplate = (args: RadioProps) => {
  const theme = useTheme()
  const { withLabel, size, label, disabled, withHelperText, helperText } = args
  const radioProps: MuiRadioProps = omit(args, ['withLabel', 'withHelperText', 'helperText'])
  const [state, setState] = useState([true, false])

  const handleChange = (event, idx) => {
    const newState = [...state]
    newState[0] = !state[0]
    newState[1] = !state[1]
    setState(newState)
  }
  const RadioComponent = props => {
    const { index } = props
    return <MuiRadio {...radioProps} onChange={e => handleChange(e, index)} checked={state[index]} name={index} />
  }
  const HelperText = props => {
    const { withHelperText, helperText } = props
    const helperTextClasses = makeStyles({ ...makeRadioHelperTextStyles(theme, size) })
    return withHelperText && <FormHelperText classes={helperTextClasses()}>{helperText}</FormHelperText>
  }
  const labelClasses = useRadioLabelStyles(theme)

  if (withLabel || withHelperText) {
    return (
      <>
        <FormControl disabled={disabled} size={size}>
          <FormControlLabel
            control={<RadioComponent index={0} {...radioProps} />}
            label={<Typography variant="body2">{label}</Typography>}
            classes={labelClasses}
          />
          {withHelperText && <HelperText {...args}>{helperText}</HelperText>}
        </FormControl>
        <p />
        <FormControl disabled={disabled} size={size}>
          <FormControlLabel
            control={<RadioComponent index={1} {...radioProps} />}
            label={<Typography variant="body2">{label}</Typography>}
            classes={labelClasses}
          />
          {withHelperText && <HelperText {...args}>{helperText}</HelperText>}
        </FormControl>
      </>
    )
  } else {
    return (
      <>
        <RadioComponent index={0} {...radioProps} />
        <p />
        <RadioComponent index={1} {...radioProps} />
      </>
    )
  }
}
