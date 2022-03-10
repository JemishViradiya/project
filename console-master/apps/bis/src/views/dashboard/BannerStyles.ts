import { makeStyles } from '@material-ui/core'

// theme.palette.link errors without the any
export default makeStyles((theme: any) => ({
  head: {
    padding: `${theme.spacing(20)}px ${theme.spacing(2.5)}px ${theme.spacing(4)}px`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'initial',
    paddingTop: '3px',
    margin: '0px',
  },
  buttonParent: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.link.default.main,
    border: '1px solid',
    borderColor: theme.palette.grey[400],
    padding: `${theme.spacing(2)}px`,
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: theme.palette.background.default,
    },
    '&.reset': {
      right: '135px',
      bottom: `${theme.spacing(12)}px`,
    },
    '&.save': {
      right: '0px',
      bottom: `${theme.spacing(12)}px`,
    },
  },
}))
