import { CYLANCE_COLORS as colors } from './../colors'

const MuiCheckbox = ({ palette }) => ({
  root: {
    '& span': {
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
    '&:hover': {
      color: palette.logicalGrey[800],
    },
    '&:active': {
      color: palette.logicalGrey[800],
    },
    '&.Mui-focusVisible': {
      boxShadow: `inset 0 0 0 2px ${palette.logicalGrey[300]}`,
    },
    '&$checked': {
      '&:hover': {
        color: colors.secondary[600],
      },
      '&:active': {
        color: colors.secondary[700],
      },
      '&$disabled': {
        color: colors.secondary[200],
      },
    },
  },
})

export default MuiCheckbox
