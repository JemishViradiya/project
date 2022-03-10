const MuiFilledInput = ({ spacing, palette }) => ({
  root: {
    borderTopLeftRadius: '2px',
    borderTopRightRadius: '2px',
    backgroundColor: palette.logicalGrey[200],
    padding: 0,
    fontSize: '0.875rem',
    borderBottom: 'none',
    '&:active': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: palette.logicalGrey[300],
    },
    '&$underline': {
      '&::after': {
        borderBottom: `2px solid ${palette.secondary.main}`,
        backgroundColor: palette.logicalGrey[200],
      },
      '&$disabled:before': {
        borderBottom: `1px solid ${palette.logicalGrey[600]}`,
      },
    },
  },

  input: {
    padding: `${spacing(6.5)}px ${spacing(2.5)}px ${spacing(2.5)}px ${spacing(3.5)}px`,
  },
  inputMarginDense: {
    paddingTop: spacing(3.5),
    paddingRight: spacing(2),
    paddingBottom: spacing(0.5),
    paddingLeft: spacing(3.5),
  },
  adornedStart: {
    paddingLeft: `${spacing(4)}px`,
  },
  adornedEnd: {
    paddingRight: `${spacing(4)}px`,
    '& .MuiIconButton-root': {
      padding: 0,
    },
  },
})

export default MuiFilledInput
