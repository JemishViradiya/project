import { CYLANCE_COLORS as colors } from './../colors'

const MuiButton = ({ spacing, palette }) => ({
  root: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.43,
    letterSpacing: '0.5px',
    padding: `${spacing(2)}px ${spacing(4)}px`,
    '&.Mui-focusVisible': {
      boxShadow: `0 0 0 2px ${palette.logicalGrey[300]}`,
    },
    '&.loading-state > .MuiButton-label': {
      opacity: 0,
    },
    '&.selected': {
      backgroundColor: colors.secondary[200],
      color: palette.logicalGrey[800],
    },
  },
  text: {
    border: 'none',
    backgroundColor: 'none',
    color: palette.logicalGrey[800],
    padding: '7px 15px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
  },
  outlined: {
    border: `1px solid ${palette.logicalGrey[600]}`,
    backgroundColor: palette.background.background,
    color: palette.logicalGrey[800],
    padding: '7px 15px', // --NOTE: accounting for 1px border here, as mui does for their "outline" buttons
    '&:hover': {
      backgroundColor: palette.logicalGrey[200],
    },
    '&:active': {
      backgroundColor: palette.logicalGrey['A100'],
    },
    '&.Mui-disabled': {
      border: `1px solid ${palette.logicalGrey['A100']}`,
    },
  },
  contained: {
    '&, &:hover, &:active': {
      boxShadow: 'none',
    },
  },
  containedPrimary: {
    // '&, &:hover, &:active': {
    //   boxShadow: 'none',
    // },
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
    '&.Mui-focusVisible': {
      boxShadow: `0 0 0 2px ${palette.logicalGrey[300]}`,
    },
  },
  containedSecondary: {
    // '&, &:hover, &:active': {
    //   boxShadow: 'none',
    // },
    '&:hover': {
      backgroundColor: colors.secondary[600],
    },
    '&:active': {
      backgroundColor: colors.secondary[700],
    },
    '&.Mui-disabled': {
      color: palette.logicalGrey[500],
      backgroundColor: palette.logicalGrey['A100'],
    },
    '&.Mui-focusVisible': {
      boxShadow: `0 0 0 2px ${palette.logicalGrey[300]}`,
    },
  },
  startIcon: {
    marginRight: `${spacing(1.5)}px`,
    '&.MuiButton-iconSizeSmall': {
      marginRight: `${spacing(1)}px`,
    },
    '&.MuiButton-iconSizeLarge': {
      marginRight: `${spacing(2)}px`,
    },
  },
  endIcon: {
    marginLeft: `${spacing(1.5)}px`,
    '&.MuiButton-iconSizeSmall': {
      marginLeft: `${spacing(1)}px`,
    },
    '&.MuiButton-iconSizeLarge': {
      marginLeft: `${spacing(2)}px`,
    },
  },

  textSizeSmall: {
    padding: `${spacing(1.75)}px ${spacing(2)}px`,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  textSizeLarge: {
    padding: `${spacing(2.25)}px ${spacing(4)}px`,
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  outlinedSizeSmall: {
    padding: `${spacing(1.5)}px ${spacing(2)}px`,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  outlinedSizeLarge: {
    padding: `${spacing(2)}px ${spacing(4)}px`,
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  containedSizeSmall: {
    padding: `${spacing(1.75)}px ${spacing(2)}px`,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  containedSizeLarge: {
    padding: `${spacing(2.25)}px ${spacing(4)}px`,
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
})

export default MuiButton
