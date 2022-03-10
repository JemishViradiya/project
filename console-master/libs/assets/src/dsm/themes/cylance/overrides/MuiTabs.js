const MuiTabs = ({ spacing, palette }) => ({
  indicator: {
    height: `${spacing(1)}px`,
  },
  vertical: {
    backgroundColor: palette.background.paper,
    border: `1px solid ${palette.type === 'dark' ? palette.logicalGrey[800] : palette.logicalGrey[300]}`,
    borderRadius: '2px',
    padding: `${spacing(2)}px 0`,
    width: '260px',
    '& .MuiTab-root': {
      padding: `${spacing(2)}px ${spacing(6)}px`,
      color: palette.type === 'dark' ? palette.logicalGrey[300] : palette.logicalGrey[800],
      minHeight: `${spacing(9)}px`,
      '&:hover': {
        color: palette.secondary.main,
        opacity: 1,
      },
    },
    '& .MuiTab-wrapper': {
      alignItems: 'start',
      fontSize: '0.875rem',
      lineHeight: '1.7rem',
      justifyContent: 'left',
      textAlign: 'left',
    },
  },
  flexContainer: {
    '&:not($flexContainerVertical)': {
      '& .MuiTab-root': {
        minWidth: 0,
        marginRight: `${spacing(4)}px`,
        '&:first-child': {
          marginLeft: `${spacing(6)}px`,
        },
        '&:last-child': {
          marginRight: 0,
        },
      },
    },
  },
  root: {
    '&.navigation': {
      '&.MuiTabs-root': {
        borderBottom: '1px solid ' + palette.divider,
        marginBottom: spacing(5),
        background: palette.type === 'dark' ? 'inherit' : palette.logicalGrey[100],
      },
    },
  },
})

export default MuiTabs
