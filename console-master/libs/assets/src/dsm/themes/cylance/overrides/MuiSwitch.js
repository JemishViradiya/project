import { CYLANCE_COLORS as colors } from './../colors'

const MuiSwitch = ({ palette }) => ({
  colorSecondary: {
    color: palette.type === 'dark' ? palette.logicalGrey[100] : palette.common.white,
    '&:hover': {
      backgroundColor: 'transparent',
      color: palette.logicalGrey[50],
    },
    '&:active': {
      color: palette.logicalGrey[200],
    },
    '&$checked': {
      '&:hover': {
        color: colors.secondary[600],
        backgroundColor: 'transparent',
      },
      '&:active': {
        color: palette.secondary.dark,
      },
      '&$track': {
        backgroundColor: palette.secondary.main,
      },
      '&$disabled': {
        color: colors.secondary[200],
        '& + $track': {
          backgroundColor: colors.secondary[50],
          opacity: 1,
        },
      },
    },
    '&$disabled': {
      color: palette.type === 'dark' ? palette.logicalGrey[100] : palette.common.white,
      '& + $track': {
        opacity: 0.38,
        backgroundColor: palette.logicalGrey[600],
      },
    },
    '&.Mui-focusVisible': {
      boxShadow: 'none',
    },
  },
  track: {
    opacity: 1,
    backgroundColor: palette.logicalGrey[600],
  },
  colorPrimary: {
    '&.Mui-focusVisible': {
      boxShadow: 'none',
    },
  },
})

export default MuiSwitch
