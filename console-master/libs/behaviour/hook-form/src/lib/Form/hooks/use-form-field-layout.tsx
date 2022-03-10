//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useTheme } from '@material-ui/core'

import {
  useCheckboxHelperStyles,
  useCheckboxLabelStyles,
  useInputFormControlStyles,
  useRadioLabelStyles,
  useSwitchHelperTextStyles,
  useSwitchLabelStyles,
} from '@ues/assets'

import type { FieldLayoutStyle, FormFieldInterface } from '../types'
import { FormFieldLayout, FormFieldType } from '../types'
import { useStyles } from './styles'

export const useFormFieldLayout = (formFieldType: FormFieldInterface['type']): FieldLayoutStyle => {
  const theme = useTheme()
  const classes = useStyles()

  const { root: inputFieldStyle } = useInputFormControlStyles(theme)
  const checkboxLabelStyles = useCheckboxLabelStyles(theme)
  const radioLabelStyles = useRadioLabelStyles(theme)
  const { label: switchLabelStyle } = useSwitchLabelStyles(theme)
  const { root: switchHelperTextStyle } = useSwitchHelperTextStyles(theme)
  const { root: checkboxHelperTextStyle } = useCheckboxHelperStyles(theme, 'small')
  const { root: radioHelperTextStyle } = useCheckboxHelperStyles(theme, 'small')

  const FORM_FIELD_LAYOUT = {
    [FormFieldType.MultiLine]: {
      [FormFieldLayout.Field]: inputFieldStyle,
    },
    [FormFieldType.Text]: {
      [FormFieldLayout.Field]: inputFieldStyle,
    },
    [FormFieldType.Select]: {
      [FormFieldLayout.Field]: classes.select,
    },
    [FormFieldType.MultiSelect]: {
      [FormFieldLayout.Field]: classes.select,
      [FormFieldLayout.Label]: classes.multiSelectLabel,
      [FormFieldLayout.EndIcon]: classes.multiSelectEndIcon,
    },
    [FormFieldType.Checkbox]: {
      [FormFieldLayout.Field]: classes.checkbox,
      [FormFieldLayout.Label]: checkboxLabelStyles,
      [FormFieldLayout.HelperText]: checkboxHelperTextStyle,
    },
    [FormFieldType.CheckboxGroup]: {
      [FormFieldLayout.Field]: classes.checkbox,
      [FormFieldLayout.Label]: checkboxLabelStyles,
      [FormFieldLayout.HelperText]: checkboxHelperTextStyle,
      [FormFieldLayout.HelperDisabledText]: `${checkboxHelperTextStyle} ${classes.disabledHelperText}`,
    },
    [FormFieldType.RadioGroup]: {
      [FormFieldLayout.Label]: radioLabelStyles,
      [FormFieldLayout.HelperText]: radioHelperTextStyle,
      [FormFieldLayout.HelperDisabledText]: `${radioHelperTextStyle} ${classes.disabledHelperText}`,
    },
    [FormFieldType.Switch]: {
      [FormFieldLayout.Field]: classes.switch,
      [FormFieldLayout.Label]: switchLabelStyle,
      [FormFieldLayout.HelperText]: switchHelperTextStyle,
      [FormFieldLayout.HelperDisabledText]: `${switchHelperTextStyle} ${classes.disabledHelperText}`,
    },
    [FormFieldType.Slider]: {
      [FormFieldLayout.HelperText]: classes.sliderHelperText,
      [FormFieldLayout.HelperDisabledText]: `${classes.sliderHelperText} ${classes.disabledHelperText}`,
    },
  }

  return FORM_FIELD_LAYOUT[formFieldType]
}
