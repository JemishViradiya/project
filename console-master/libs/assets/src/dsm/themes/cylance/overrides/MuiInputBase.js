const MuiInputBase = ({ palette, spacing }) => ({
  root: {
    '&.no-label': {
      '& .MuiInputBase-marginDense': {
        '& div': {
          paddingTop: spacing(2.5),
          paddingBottom: spacing(2.5),
        },
      },
      '& div:not(.MuiInputBase-inputMarginDense)': {
        paddingTop: spacing(5),
        paddingBottom: spacing(5),
      },
    },
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    '& button': {
      '&.MuiIconButton-root': {
        padding: 0,
      },
    },
    '&$disabled': {
      '& svg': {
        '&.MuiSelect-icon': {
          color: palette.text.disabled,
        },
      },
    },
  },
  marginDense: {
    fontSize: '0.875rem',
    '&.no-label': {
      '& div': {
        paddingTop: spacing(2.5),
        paddingBottom: spacing(2.5),
      },
    },
    '& span ': {
      '& svg': {
        '&.MuiSvgIcon-root': {
          fontSize: '1.25rem',
        },
      },
    },
  },
  inputMarginDense: {
    fontSize: '0.875rem',
    '&.no-label': {
      '& div': {
        paddingTop: spacing(2.5),
        paddingBottom: spacing(2.5),
      },
    },
  },
  input: {
    height: 'unset',
    '&$disabled': {
      color: palette.text.disabled,
    },
  },
})

export default MuiInputBase
