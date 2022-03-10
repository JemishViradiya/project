import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import { MAX_INPUT_FIELD_WIDTH, MIN_INPUT_FIELD_WIDTH } from '../common'

export const defaultWidthFormControl = {
  root: {
    '&.MuiFormControl-root': {
      maxWidth: MAX_INPUT_FIELD_WIDTH,
      '& > .MuiInputBase-root': {
        width: MIN_INPUT_FIELD_WIDTH,
        maxWidth: MAX_INPUT_FIELD_WIDTH,
        minWidth: MIN_INPUT_FIELD_WIDTH,
      },
      '& > .MuiInputBase-fullWidth': {
        width: '100%',
      },
    },
  },
}

export const useDefaultFormControlStyles = (theme?: Theme): Record<string, string> =>
  makeStyles<Theme>(theme => defaultWidthFormControl)()
export const makeDefaultInputFormControlStyles = (theme?: Theme): Record<string, CSSProperties> => defaultWidthFormControl
