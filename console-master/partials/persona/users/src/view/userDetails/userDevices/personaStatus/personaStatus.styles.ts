import type { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'

const useStyle = makeStyles((theme: Theme) => ({
  midCol: {
    maxWidth: '90px',
  },
  scoring: {
    color: theme.palette.secondary.main,
  },
  paused: {
    color: theme.palette.grey[500],
  },
  training: {
    color: theme.palette.secondary.main,
  },
  boxPaddingTop: {
    paddingTop: 30,
  },
  headerItem: {
    borderBottom: `2px solid ${theme.palette.grey[500]}`,
  },
}))

export default useStyle
