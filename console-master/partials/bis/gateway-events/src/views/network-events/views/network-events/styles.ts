import makeStyles from '@material-ui/core/styles/makeStyles'

export const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  content: {
    padding: theme.spacing(6),
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
}))
