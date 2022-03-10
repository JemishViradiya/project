const MuiTab = ({ spacing, palette }) => ({
  root: {
    textTransform: 'capitalize',
    fontWeight: '600',
    padding: `${spacing(1.5)}px ${spacing(1)}px`,
    '&.navigation': {
      fontSize: '1rem',
      lineHeight: '52px',
      padding: '0 4px',
      marginRight: '36px !important',
      '&$disabled': {
        fontSize: '1rem',
      },
    },
  },
})

export default MuiTab
