import { CYLANCE_COLORS as colors } from './../colors'

const MuiRadio = ({ palette }) => ({
  root: {
    backgroundColor: 'transparent !important',
    '& div': {
      '& svg': {
        '&.MuiSvgIcon-root': {
          fontSize: '1.5rem',
        },
        '&.MuiSvgIcon-fontSizeSmall': {
          fontSize: '1.25rem',
        },
      },
    },
  },
  colorSecondary: {
    '&:focus': {
      padding: 0,
      margin: '9px',
      boxShadow: `inset 0px 0px 0px 4px ${palette.type === 'light' ? colors.secondary[100] : colors.secondary[900]}`,
      borderRadius: '50%',
    },
    '&:hover': {
      color: palette.type === 'light' ? colors.secondary[600] : colors.secondary[400],
      backgroundColor: 'transparent',
    },
    '&:active': {
      color: palette.type === 'light' ? colors.secondary[600] : colors.secondary[400],
    },
    '&$checked': {
      '&$disabled': {
        color: palette.type === 'light' ? colors.secondary[100] : colors.secondary[900],
      },
      '&:hover': {
        backgroundColor: 'transparent',
        color: palette.type === 'light' ? colors.secondary[600] : colors.secondary[400],
      },
      '&:focus': {
        padding: 0,
        margin: '9px',
        boxShadow: `inset 0px 0px 0px 4px ${palette.type === 'light' ? colors.secondary[100] : colors.secondary[900]}`,
        borderRadius: '50%',
      },
      '&:active': {
        color: palette.secondary.dark,
      },
    },
  },
})

export default MuiRadio
