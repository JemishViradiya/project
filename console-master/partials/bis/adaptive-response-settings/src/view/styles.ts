import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  card: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&:last-of-type': {
      marginBottom: theme.spacing(6),
    },
  },
  operatingModeSelectWrapper: {
    marginBottom: 0,
  },
}))
