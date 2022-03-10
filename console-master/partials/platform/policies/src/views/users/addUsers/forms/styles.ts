import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(theme => ({
  popperPaper: {
    maxHeight: 400,
    overflow: 'auto',
  },
  addNewUserText: {
    color: theme.palette['link'].default.main,
  },
  addNewUserPanel: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  dataSourcePanel: {
    marginLeft: 'auto',
    flex: 'none',
  },
}))
