const MuiAutocomplete = ({ palette }) => ({
  option: {
    '&[data-focus="true"]': {
      backgroundColor: palette.logicalGrey[200],
    },
    '&[aria-selected="true"]': {
      backgroundColor: palette.logicalGrey['A100'],
    },
    '&:active': {
      backgroundColor: palette.logicalGrey[200],
    },
  },
  popupIndicator: {
    color: 'none',
  },
  clearIndicator: {
    color: 'none',
  },
})

export default MuiAutocomplete
