import { omit } from 'lodash-es'
import React, { useState } from 'react'

import type { CheckboxProps as MuiCheckboxProps } from '@material-ui/core'
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core'

import { makeCheckboxHelperTextStyles, useCheckboxLabelStyles } from '@ues/assets'

export interface CheckboxProps extends MuiCheckboxProps {
  withLabel?: boolean
  withHelperText?: boolean
  label?: string
  helperText?: string
}

export const CheckboxTemplate = (args: CheckboxProps) => {
  //console.log(`Template args: ${JSON.stringify(args)}`)

  const theme = useTheme()
  const { withLabel, size, label, disabled, withHelperText, helperText } = args
  const checkboxProps: MuiCheckboxProps = omit(args, ['withLabel', 'withHelperText', 'helperText'])

  const [state, setState] = useState([true, false])

  const handleChange = (event, idx) => {
    const newState = [...state]
    newState[idx] = !state[idx]
    setState(newState)
  }

  const CheckboxComponent = props => {
    const { index } = props
    return (
      <MuiCheckbox {...checkboxProps} onChange={e => handleChange(e, index)} checked={state[index]} name={`checkbox-${index}`} />
    )
  }
  const HelperText = props => {
    const { withHelperText, helperText } = props
    const helperTextClasses = makeStyles({ ...makeCheckboxHelperTextStyles(theme, size) })
    return withHelperText && <FormHelperText classes={helperTextClasses()}>{helperText}</FormHelperText>
  }
  const labelClasses = useCheckboxLabelStyles(theme)

  if (withLabel || withHelperText) {
    return (
      <>
        <FormControl disabled={disabled} size={size}>
          <FormControlLabel
            control={<CheckboxComponent index={0} {...checkboxProps} />}
            label={<Typography variant="body2">{label}</Typography>}
            classes={labelClasses}
          />
          {withHelperText && <HelperText {...args}>{helperText}</HelperText>}
        </FormControl>
        <p />
        <FormControl disabled={disabled} size={size}>
          <FormControlLabel
            control={<CheckboxComponent index={1} {...checkboxProps} />}
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
        <CheckboxComponent index={0} {...checkboxProps} />
        <p />
        <CheckboxComponent index={1} {...checkboxProps} />
      </>
    )
  }
}
