import { makeStyles } from '@material-ui/core'

export const useAccordionDetailsTableStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paper: {
    margin: theme.spacing(2, 6),
  },
  rowStyles: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
  },
  rowTitle: {
    width: theme.spacing(31),
    marginLeft: theme.spacing(2),
  },
  rowDetails: {
    width: theme.spacing(75),
    marginLeft: theme.spacing(4),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))
