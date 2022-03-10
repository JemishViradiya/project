import { makeStyles } from '@material-ui/core'

export const useAccordionTableStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paper: {
    margin: theme.spacing(2, 6),
  },
  rowStyles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.grey['700'],
    wordWrap: 'break-word',
  },
  paddingRight: {
    paddingRight: theme.spacing(1),
  },
  hr: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  rowTitle: {
    width: theme.spacing(31),
    marginLeft: theme.spacing(2),
    '&.full': {
      width: theme.spacing(106),
      marginRight: theme.spacing(4),
    },
    '&.rowTitleGrow': {
      flexGrow: 1,
    },
  },
  rowDetails: {
    width: theme.spacing(75),
    marginLeft: theme.spacing(4),
  },
}))
