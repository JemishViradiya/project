const MuiSnackbar = ({ spacing, palette }) => ({
  root: {
    '& .MuiAlert-root': {
      borderRadius: '2px',
      maxWidth: '400px',
      padding: `${spacing(3)}px ${spacing(4)}px`,
    },
    '& .MuiAlert-icon': {
      alignItems: 'center',
    },
    '&.MuiSnackbar-anchorOriginTopCenter': {
      // there is an existing 14px offset + 6px top margin,
      // so this adds the last 12px needed for a 32px top offset
      top: '12px',
    },
    '& .MuiIconButton-root:hover, & .MuiIconButton-root:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    '& .MuiAlert-filledSuccess': {
      backgroundColor: palette.util.success,
    },
    '& .MuiAlert-filledWarning': {
      backgroundColor: palette.util.warning,
    },
    '& .MuiAlert-filledInfo': {
      backgroundColor: palette.util.info,
    },
    '& .MuiAlert-filledError': {
      backgroundColor: palette.util.error,
    },
  },
})

export default MuiSnackbar
