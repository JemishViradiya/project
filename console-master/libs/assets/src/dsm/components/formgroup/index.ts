import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

import { MAX_INPUT_FIELD_WIDTH } from '../common'

const formGroupStyles = (theme?: Theme) => ({
  root: { maxWidth: MAX_INPUT_FIELD_WIDTH },
})

export const useFormGroupStyles = makeStyles<Theme>(theme => formGroupStyles(theme))
export const makeFormGroupStyles = (theme?: Theme): Record<string, CSSProperties> => formGroupStyles(theme)
