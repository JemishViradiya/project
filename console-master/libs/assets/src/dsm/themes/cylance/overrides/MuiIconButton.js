import { CYLANCE_COLORS as colors } from './../colors'

const MuiIconButton = ({ spacing, palette }) => ({
  root: {
    //padding: spacing(2),
    borderRadius: '2px',
    color: palette.logicalGrey[600],
    backgroundColor: 'transparent',
    '&.Mui-focusVisible': {
      boxShadow: `inset 0 0 0 2px ${palette.logicalGrey[300]}`,
    },
    '&:hover': {
      backgroundColor: `${palette.logicalGrey[700]}14`,
    },
    '&:active': {
      backgroundColor: `${palette.logicalGrey[700]}14`,
    },
    '&.Mui-disabled': {
      color: palette.logicalGrey['A100'],
      backgroundColor: 'transparent',
    },
    '& span': {
      '& svg': {
        '&.MuiSvgIcon-root': {
          fontSize: '1.5rem',
        },
      },
    },
  },
  colorPrimary: {
    color: palette.common[palette.type === 'dark' ? 'black' : 'white'],
    backgroundColor: colors.primary[500],
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
    '&:active': {
      backgroundColor: colors.primary[700],
    },
    '&.Mui-disabled': {
      color: palette.logicalGrey[500],
      backgroundColor: palette.logicalGrey['A100'],
    },
  },
  sizeSmall: {
    padding: spacing(2),
    '& span': {
      '& svg': {
        '&.MuiSvgIcon-root': {
          fontSize: '1.25rem',
        },
      },
    },
  },
  label: {
    outline: 'none',
  },
})

export default MuiIconButton
