import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

export default makeStyles((theme: Theme) => ({
  formControl: {
    width: '100%',
  },
  buttons: {
    padding: `0 ${theme.spacing(2)}px`,
  },
  list: {
    height: '218px',
    overflow: 'auto',
  },
  cardHeaderContent: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  cardHeaderRoot: {
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
  },
  textDisabled: {
    color: theme.palette.text.disabled,
  },
  listLabel: {
    paddingBottom: theme.spacing(3),
  },
  cardRoot: {
    width: '256px',
    height: '300px',
    border: `solid 1px ${theme.palette.divider}`,
    overflow: 'hidden',
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px ${theme.spacing(2)}px ${theme.spacing(4)}px`,
  },
  gridError: {
    borderColor: theme.palette.error.main,
  },
  listItemGutters: {
    paddingLeft: theme.spacing(0.5),
  },
  listItemRoot: {
    '&.MuiListItem-root.Mui-disabled': {
      opacity: 'unset',
    },
    '& .MuiListItemText-root': {
      paddingLeft: theme.spacing(1),
    },
  },
}))
