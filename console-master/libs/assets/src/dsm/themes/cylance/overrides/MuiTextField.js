const MuiTextField = ({ spacing }) => ({
  root: {
    lineHeight: '1rem',
    '&.no-label': {
      '& .MuiInputBase-root input': {
        paddingTop: spacing(5),
        paddingBottom: spacing(5),
      },
      '& .MuiInputBase-marginDense input': {
        paddingTop: spacing(2.5),
        paddingBottom: spacing(2.5),
      },
    },
    '&.dragAndDrop-input': {
      width: spacing(12),
    },
  },
})

export default MuiTextField
