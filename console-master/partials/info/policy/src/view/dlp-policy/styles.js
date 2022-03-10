import { makeStyles } from '@material-ui/core'

import { ROW_HEIGHT, spacing_24px } from '@ues-info/shared'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
  numberSelected: {
    paddingTop: theme.spacing(2.5),
  },
  selectedTemplateName: {
    marginBottom: theme.spacing(0.5),
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    height: ROW_HEIGHT * 15, // ROW_HEIGHT = 53 in infiniteTableHooks.tsx
    maxHeight: ROW_HEIGHT * 15,
  },
  buttonPanel: {
    marginTop: theme.spacing(6),
  },
}))
