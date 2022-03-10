const MuiPickersDay = ({ palette }) => ({
  current: {
    backgroundColor: palette.logicalGrey[300],
    color: palette.text.primary,
  },
  daySelected: {
    backgroundColor: palette.secondary.main,
  },
  dayDisabled: {
    color: palette.text.disabled,
    '&.MuiPickersDay-daySelected': {
      color: palette.common[palette.type === 'dark' ? 'black' : 'white'],
    },
  },
})

export default MuiPickersDay
