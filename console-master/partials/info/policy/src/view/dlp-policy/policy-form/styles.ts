import { makeStyles } from '@material-ui/core'

export const policyStyles = makeStyles(theme => ({
  buttonPanel: {
    marginTop: theme.spacing(6),
  },
  actionSelectsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      flex: '0 1 240px',
      marginRight: theme.spacing(6),
    },
  },
  specificSettingsWrapper: {
    display: 'flex',
    alignItems: 'baseline',
    '& > .MuiFormControl-root': {
      margin: `0 ${theme.spacing(1)}px 0 ${theme.spacing(1)}px`,
    },
    '& .MuiFormControl-root:nth-last-child(2)': {
      width: theme.spacing(15),
      '& input': {
        textAlign: 'center',
        paddingLeft: theme.spacing(2.5),
        paddingRight: theme.spacing(2.5),
      },
    },
    '& .Mui-error': {
      whiteSpace: 'nowrap',
      marginLeft: theme.spacing(0),
    },
  },
  formWrapper: {
    display: 'flex',
    '& form': {
      flexGrow: 1,
      maxWidth: theme.spacing(180),
    },
  },
  policyTooltip: {
    width: theme.spacing(6),
    marginLeft: theme.spacing(2),
    alignSelf: 'flex-end',
  },
}))
