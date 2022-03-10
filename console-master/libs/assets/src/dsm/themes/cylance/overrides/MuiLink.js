const MuiLink = ({ palette }) => ({
  root: {
    cursor: 'pointer',
    '&.MuiTypography-colorPrimary, &.MuiTypography-colorInherit': {
      color: palette.link.default.main,
      '&:hover': {
        color: palette.link.default.hover,
      },
      '&:active': {
        color: palette.link.default.active,
      },
    },
    '&.MuiTypography-colorTextSecondary': {
      color: palette.link.secondary.main,
      '&:hover': {
        color: palette.link.secondary.hover,
      },
      '&:active': {
        color: palette.link.secondary.active,
      },
    },
  },
})

export default MuiLink
