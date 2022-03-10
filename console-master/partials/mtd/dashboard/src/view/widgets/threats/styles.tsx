import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  chartListContainer: {
    height: '100%',
    paddingTop: 0,
    paddingBottom: theme.spacing(1),
  },
  chartContainer: {
    height: '100%',
    paddingTop: 0,
  },
  chartHeader: {
    paddingBottom: 0,
  },
  selectContainer: {
    display: 'inline-flex',
    marginLeft: 'auto',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  chartExtContainer: {
    display: 'inline-flex',
    marginLeft: 'auto',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
}))
