import { CYLANCE_COLORS as colors } from './../colors'

const MuiListItem = ({ palette }) => ({
  root: {
    display: 'flex !important',
    position: 'relative !important',
    alignItems: 'center !important',
    justifyContent: 'flex-start !important',
    textDecoration: 'none !important',
    '&.Mui-selected': {
      backgroundColor: colors.secondary[50],
      color: palette.text.primary,
      '&:hover': {
        backgroundColor: palette.logicalGrey[100],
      },
    },
  },
  button: {
    color: palette.text.primary,
    letterSpacing: '0.5px',
    '&:active': {
      backgroundColor: colors.secondary[50],
    },
    '&:hover': {
      backgroundColor: palette.logicalGrey[100],
    },
    '&.Mui-disabled': {
      color: palette.text.disabled,
    },
  },
})

export default MuiListItem
