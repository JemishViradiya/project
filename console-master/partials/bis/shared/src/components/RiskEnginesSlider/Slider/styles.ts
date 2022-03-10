import { makeStyles } from '@material-ui/core'

export default makeStyles(theme => ({
  sliderWrapper: {
    width: 250,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    position: 'relative',
    display: 'flex',
  },
  labelText: {
    whiteSpace: 'nowrap',
    lineHeight: `${theme.spacing(8)}px`,
    margin: 0,
  },
  inputSliderWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(30),
    width: '100%',
  },
}))
