const MuiAlert = ({ palette }) => ({
  outlinedError: {
    border: `1px solid ${palette.alert.errorBorder}`,
    backgroundColor: palette.alert.error,
    color: palette.text.primary,
  },
  outlinedWarning: {
    border: `1px solid ${palette.alert.warningBorder}`,
    backgroundColor: palette.alert.warning,
    color: palette.text.primary,
  },
  outlinedInfo: {
    border: `1px solid ${palette.alert.infoBorder}`,
    backgroundColor: palette.alert.info,
    color: palette.text.primary,
  },
})

export default MuiAlert
