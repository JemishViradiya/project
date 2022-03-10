import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { CSSProperties } from '@material-ui/core/styles/withStyles'

const dialogStyles = (theme: Theme) => ({
  closeButton: {
    top: -theme.spacing(1),
    right: -theme.spacing(2),
  },
})

export const useDialogStyles = makeStyles<Theme>(theme => dialogStyles(theme))
export const makeDialosStyles = (theme?: Theme): Record<string, CSSProperties> => dialogStyles(theme)
