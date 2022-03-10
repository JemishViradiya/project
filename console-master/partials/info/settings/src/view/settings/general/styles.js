import { makeStyles } from '@material-ui/core'

import { ROW_HEIGHT, spacing_24px, spacing_32px } from '@ues-info/shared'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(10),
    padding: `${theme.spacing(spacing_24px)}px ${theme.spacing(spacing_32px)}px ${theme.spacing(spacing_32px)}px`,
    maxWidth: '1024px',
    justifyContent: 'center',
    margin: 'auto',
    width: '1024px',
  },
  margin: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2),

    '& .MuiFilledInput-multiline': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginRight: theme.spacing(60),
    },
  },
  container: {
    marginBottom: theme.spacing(10),
  },
  description: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(60),
  },
  title: {
    marginBottom: theme.spacing(8),
    marginRight: theme.spacing(spacing_24px),
  },
  tableName: {
    marginLeft: theme.spacing(spacing_24px),
    marginBottom: theme.spacing(3),
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: ROW_HEIGHT * 5, //header + 4 row;  ROW_HEIGHT = 53 in infiniteTableHooks.tsx
  },
}))
