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
    paddingBottom: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  rowTitle: {
    width: '125px',
    marginLeft: '8px',
  },
  rowDetails: {
    width: '300px',
    marginLeft: '15px',
  },
}))
