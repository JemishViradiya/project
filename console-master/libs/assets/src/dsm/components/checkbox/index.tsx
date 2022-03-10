import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import { MAX_INPUT_FIELD_WIDTH } from '../common'

const helperTextStyles = (theme: Theme, size: string) => ({
  root: {
    '&.MuiFormHelperText-root': {
      marginLeft: size === 'small' ? '2.25em' : '2.6em',
      maxWidth: MAX_INPUT_FIELD_WIDTH,
      marginBottom: 0,
      paddingLeft: theme.spacing(1),
    },
  },
})

const labelStyles = (theme: Theme) => ({
  label: {
    '&.MuiFormControlLabel-label': {
      alignSelf: 'center',
      paddingLeft: theme.spacing(1),
    },
  },
})

export const makeCheckboxHelperTextStyles = (theme: Theme, size: string): Record<string, CSSProperties> =>
  helperTextStyles(theme, size)

export const useCheckboxLabelStyles = (theme: Theme): Record<string, string> => {
  return makeStyles<Theme>(() => labelStyles(theme))()
}

export const useCheckboxHelperStyles = (theme: Theme, size: string): Record<string, string> => {
  return makeStyles<Theme>(() => helperTextStyles(theme, size))()
}

export const makeCheckboxLabelStyles = (theme: Theme, size: string): Record<string, CSSProperties> => labelStyles(theme)
