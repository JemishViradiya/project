const MuiInputLabel = ({ palette }) => ({
  shrink: {
    color: palette.text.hint,
    transform: 'translate(0, -4px) scale(1)',
    fontSize: '0.75rem',
    '&$marginDense': {
      fontSize: '0.875rem',
      '&$shrink': {
        fontSize: '0.75rem',
        transform: 'translate(0px, 0px) scale(1)',
      },
    },
  },
  filled: {
    transform: 'translate(14px, 20px) scale(1)',
    '&$shrink': {
      fontSize: '0.75rem',
      transform: 'translate(14px, 4px) scale(1)',
      '&$marginDense': {
        fontSize: '0.75rem',
        transform: 'translate(14px, 0px) scale(1)',
      },
    },
    '&$marginDense': {
      transform: 'translate(14px, 10px) scale(1)',
      fontSize: '0.875rem',
    },
  },
  outlined: {
    '&$shrink': {
      fontSize: '0.75rem',
      transform: 'translate(14px, -6px) scale(1)',
    },
    '&$marginDense': {
      fontSize: '0.875rem',
      '&$shrink': {
        fontSize: '0.75rem',
        transform: 'translate(12px, -6px) scale(1)',
      },
    },
  },
})

export default MuiInputLabel
