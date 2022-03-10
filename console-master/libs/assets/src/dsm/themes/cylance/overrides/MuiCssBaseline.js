const MuiCssBaseline = ({ typography, palette }) => ({
  '@global': {
    body: {
      backgroundColor: `${palette.background.body} !important`,
      // margin: `0 !important`,
      // backgroundColor: palette.background.body,
      color: palette.text.primary,
      fontSize: typography.fontSize,
      fontFamily: typography.fontFamily,
      lineHeight: typography.body2.lineHeight,
      letterSpacing: typography.body2.letterSpacing,
      '&::backdrop': {
        backgroundColor: palette.background.body,
      },
    },
    a: {
      cursor: 'pointer',
    },
  },
})

export default MuiCssBaseline
