const MuiDialogActions = ({ spacing }) => ({
  root: {
    padding: [[spacing(6), spacing(8)]],
  },
  spacing: {
    '& button:not(:first-child)': {
      marginLeft: spacing(4),
    },
  },
})

export default MuiDialogActions
