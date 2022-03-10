import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import { MAX_INPUT_FIELD_WIDTH } from '../common'

const helperTextStyles = (theme: Theme) => ({
  root: {
    '&.MuiFormHelperText-root': {
      marginLeft: '3.75em',
      maxWidth: MAX_INPUT_FIELD_WIDTH,
    },
  },
})

const labelStyles = (theme: Theme) => ({
  label: {
    '&.MuiFormControlLabel-label': {
      alignSelf: 'center',
    },
  },
})

const formGroupStyles = (theme?: Theme) => ({
  root: { maxWidth: MAX_INPUT_FIELD_WIDTH },
})

export const useSwitchHelperTextStyles = makeStyles<Theme>(theme => helperTextStyles(theme))
export const makeSwitchHelperTextStyles = (theme?: Theme): Record<string, CSSProperties> => helperTextStyles(theme)

export const useSwitchLabelStyles = makeStyles<Theme>(theme => labelStyles(theme))
export const makeSwitchLabelStyles = (theme: Theme): Record<string, CSSProperties> => labelStyles(theme)

export const useSwitchFormGroupStyles = makeStyles<Theme>(theme => formGroupStyles(theme))
export const makeSwitchFormGroupStyles = (theme: Theme): Record<string, CSSProperties> => formGroupStyles(theme)
