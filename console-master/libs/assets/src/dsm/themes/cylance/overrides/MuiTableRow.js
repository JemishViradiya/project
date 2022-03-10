import { CYLANCE_COLORS as colors } from './../colors'

const MuiTableRow = ({ palette }) => ({
  root: {
    '&$selected': {
      backgroundColor: colors.secondary[50],
    },
    '&$hover:hover': {
      backgroundColor: palette.logicalGrey[100],
    },
  },
})

export default MuiTableRow
