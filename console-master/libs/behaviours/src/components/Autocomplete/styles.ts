import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(theme => ({
  textFieldLabel: {
    lineHeight: '1.35rem',
  },
  root: {
    // This is a specific solution that we not need to override global styles
    '& .MuiAutocomplete-inputRoot': {
      paddingTop: theme.spacing(2.5),
      paddingBottom: `${theme.spacing(2.2)}px !important`,
    },
  },
  chip: {
    maxHeight: '0.8rem',
  },
  poper: {
    marginTop: '0.2rem',
    maxHeight: theme.spacing(82),
    height: '45vh',
    zIndex: 10,
  },
  paper: {
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    minHeight: theme.spacing(6),
    maxHeight: theme.spacing(82),
  },
  listBox: {
    height: 'auto',
    minHeight: theme.spacing(6),
    maxHeight: theme.spacing(82),
  },
  newTagPaper: {
    fontSize: '0.9rem',
    padding: '0.4rem',
    width: '100%',
    cursor: 'pointer',
    marginLeft: '0.15rem',
    fontWeight: 'bold',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
    transform: 'translate(-0.12%,1%)',
  },
  optionsText: {
    fontSize: '0.9rem',
  },
  noOptions: {
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#424242',
    fontSize: '0.9rem',
  },
  boldText: {
    fontWeight: 'bold',
  },
}))
