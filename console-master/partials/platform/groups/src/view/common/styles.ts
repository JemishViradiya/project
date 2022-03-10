import { makeStyles } from '@material-ui/core'

export const paperStyles = makeStyles(theme => ({
  paper: {
    width: 1024,
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing(6)}px ${theme.spacing(8)}px`,
    marginBottom: theme.spacing(6),
    '& > *': {
      marginBottom: theme.spacing(6),
    },
    marginRight: 'auto',
    marginLeft: 'auto',
  },
}))

export const listStyles = makeStyles(theme => ({
  root: {
    maxHeight: '30vh',
    overflow: 'auto',
  },
}))
