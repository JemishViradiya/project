import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  box: {
    '& .MuiBox-root .MuiDrawer-root': {
      position: 'fixed',
    },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}))
