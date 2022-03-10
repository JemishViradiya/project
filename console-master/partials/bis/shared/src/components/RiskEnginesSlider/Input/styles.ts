import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  input: {
    marginBottom: 0,
    maxWidth: theme.spacing(16),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
    marginTop: 0,
    marginBottom: 0,
  },
}))
