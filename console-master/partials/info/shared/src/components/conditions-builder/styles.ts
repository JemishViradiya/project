import { makeStyles } from '@material-ui/core'

const defaultBorderColor = '1px solid #AEB5BB'
const borderBoxSizing = 'border-box'

export const conditionBuilderStyles = makeStyles(theme => ({
  wrapper: {
    border: defaultBorderColor,
    borderRadius: '2px',
    padding: '24px 16px',
    backgroundColor: '#FBFBFC',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectPlaceholder: {
    opacity: '.5',
  },
  conditionWrapper: {
    position: 'relative',
    marginRight: '16px',
    border: '1px solid #69D03C',
    borderRadius: '2px',
    '&:not(:hover) label': {
      opacity: '0',
      width: '0',
      padding: '0',
    },
    '& span > input[type="radio"], & > input[type="radio"]': {
      display: 'none',
      visibility: 'hidden',
      '&:checked + label': {
        backgroundColor: '#59BF34',
        color: 'white',
        opacity: '1',
        width: '60px',
        padding: '6px',
      },
    },
    '& span > label, & > label': {
      display: 'inline-block',
      backgroundColor: 'rgba(105, 208, 60, 0.08)',
      textAlign: 'center',
      textTransform: 'uppercase',
      color: '#69D03C;',
      fontWeight: '600',
      lineHeight: '1.5rem',
      fontSize: '14px',
      opacity: '1',
      width: '60px',
      padding: '6px',
      fontFamily: 'Titillium Web,sans-serif',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
    '&::before': {
      content: `''`,
      position: 'absolute',
      top: '50%',
      left: '-24px',
      width: '24px',
      height: 'calc(50% + 5px)',
      borderColor: '#AEB5BB',
      borderStyle: 'solid',
      boxSizing: borderBoxSizing,
      borderWidth: '1px 0 0 1px',
    },
  },
  group: {
    position: 'relative',
    paddingLeft: '24px',
    '& > div:only-child': {
      '& > div::before': {
        display: 'none',
      },
    },
  },
  childGroup: {
    position: 'relative',
    marginTop: theme.spacing(4),
    padding: '16px 16px 16px 40px',
    border: defaultBorderColor,
    '&::before, &:after': {
      content: `''`,
      position: 'absolute',
      width: '24px',
      height: 'calc(50% + 20px)',
      left: '-24px',
      top: '-20px',
      borderColor: '#AEB5BB',
      borderStyle: 'solid',
      boxSizing: borderBoxSizing,
      borderWidth: '0 0 1px 1px',
    },
    '&:after': {
      top: '50%',
      borderWidth: '0 0 0 1px',
    },
    '&:last-child::after': {
      display: 'none',
    },
    '& > div:only-child': {
      '& > div::before': {
        display: 'none',
      },
    },
  },
  rule: {
    display: 'flex',
    position: 'relative',
    backgroundColor: 'white',
    marginTop: '16px',
    padding: '12px 16px',
    border: defaultBorderColor,
    '& .MuiFormControl-root': {
      marginBottom: '0',
    },
    '&::before, &:after': {
      content: `''`,
      display: 'block',
      position: 'absolute',
      width: '24px',
      height: 'calc(50% + 20px)',
      left: '-24px',
      top: '-20px',
      borderColor: '#AEB5BB',
      borderStyle: 'solid',
      boxSizing: borderBoxSizing,
      borderWidth: '0 0 1px 1px',
    },
    '&:after': {
      top: '50%',
      borderWidth: '0 0 0 1px',
    },
    '&:last-child::after': {
      display: 'none',
    },
  },
  occurrence: {
    width: theme.spacing(15.5),
    height: theme.spacing(11.25),
    whiteSpace: 'nowrap',
    '& .MuiInputBase-input': {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
    },
    '& .MuiFormHelperText-root.Mui-error': {
      marginTop: 0,
      marginLeft: 0,
    },
  },
  occurrenceLabel: {
    margin: ' 0 16px 0 0',
    alignSelf: 'center',
  },
  selectWrapper: {
    margin: ' 0 16px 0 0',
  },
  button: {
    marginLeft: theme.spacing(2),
    border: 'none !important',
    background: 'none !important',
    opacity: '.7',
    '&:hover': {
      opacity: '1',
    },
  },
  iconButton: {
    margin: '0 0 0 auto',
  },
}))
