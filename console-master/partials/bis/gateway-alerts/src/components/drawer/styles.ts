import { makeStyles } from '@material-ui/core/styles'

import type { UesTheme } from '@ues/assets'

export const useStyles = makeStyles<UesTheme>(theme => ({
  title: {
    paddingLeft: '24px',
    paddingBottom: '8px',
  },
  closeIcon: {
    marginLeft: 'auto',
    marginBottom: '39px',
  },
  paper: {
    backgroundColor: theme.palette.background.body,
    width: '600px',
  },
  arrContainer: {
    alignItems: 'center',
    display: 'flex',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& > svg': {
      width: '1rem',
      height: '1rem',
      marginRight: theme.spacing(2),
    },
  },
  responseActionsSubtitleContainer: {
    paddingBottom: theme.spacing(3),
  },
}))
