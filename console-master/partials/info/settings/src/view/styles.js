import { makeStyles } from '@material-ui/core'

import { ROW_HEIGHT } from '@ues-info/shared'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    margin: theme.spacing(6),
    marginTop: theme.spacing(4),
    padding: `${theme.spacing(4)}px ${theme.spacing(5)}px`,
  },
  box: {
    marginBottom: theme.spacing(4),
  },
  numberSelected: {
    paddingTop: theme.spacing(2.5),
  },
  selectedTemplateName: {
    marginBottom: theme.spacing(0.5),
  },
  selectedDataTypeName: {
    marginBottom: theme.spacing(0.5),
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    height: ROW_HEIGHT * 15, // ROW_HEIGHT = 53 in infiniteTableHooks.tsx
    maxHeight: ROW_HEIGHT * 15,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  warning: {
    color: theme.palette.error.main,
    lineHeight: 1,
    marginLeft: theme.spacing(1.5),
  },
  description: {
    marginTop: theme.spacing(2),
  },
}))
