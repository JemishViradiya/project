import makeStyles from '@material-ui/core/styles/makeStyles'

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  list: {
    flexGrow: 1,
  },
  infoLink: {
    marginLeft: theme.spacing(1),
  },
}))
