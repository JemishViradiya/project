import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  buttons: {
    background: theme.palette.background.default,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
    width: '100%',
    zIndex: 2,

    '& button': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
}))
