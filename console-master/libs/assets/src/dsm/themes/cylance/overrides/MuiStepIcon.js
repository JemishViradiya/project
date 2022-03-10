const MuiStepIcon = ({ palette }) => ({
  root: {
    '&$active': {
      color: palette.secondary.main,
    },
    '&$completed': {
      color: palette.secondary.main,
    },
  },
})

export default MuiStepIcon
