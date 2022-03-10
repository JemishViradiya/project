import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  boxContainer: {
    border: `1px solid ${theme.palette.grey[300]}`,
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    maxWidth: `350px`,
    padding: theme.spacing(4),
  },
}))
