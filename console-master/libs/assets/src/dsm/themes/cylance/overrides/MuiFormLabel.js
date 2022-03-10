import { CYLANCE_COLORS as colors } from './../colors'

const MuiFormLabel = {
  root: {
    fontSize: '0.875rem',
    lineHeight: '1rem',
    '&$focused': {
      //fontSize: '16px',
      color: colors.secondary[800],
    },
    '&$filled': {
      // fontSize: '16px',
    },
  },
}

export default MuiFormLabel
