import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import { MAX_INPUT_FIELD_WIDTH, MIN_INPUT_FIELD_WIDTH } from '../common'

const inputFieldStyles = {
  root: {
    '&.MuiTextField-root': {
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
  iconButton: {
    '&.MuiButtonBase-root': {
      '&:hover': {
        backgroundColor: 'unset',
      },
    },
  },
}

export const useInputFormControlStyles = (theme?: Theme): Record<string, string> => makeStyles<Theme>(theme => inputFieldStyles)()
export const makeInputFormControlStyles = (theme?: Theme): Record<string, CSSProperties> => inputFieldStyles

export const rightAlignedInputHelperTextProps = {
  FormHelperTextProps: { className: 'right-aligned' },
}
