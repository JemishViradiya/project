const MuiTableSortLabel = ({ spacing, palette }) => ({
  iconDirectionAsc: {
    transform: 'rotate(180deg)',
  },
  iconDirectionDesc: {
    transform: 'rotate(0deg)',
  },
  icon: {
    '&.MuiSvgIcon-root': {
      marginRight: spacing(0),
      fontSize: spacing(4),
    },
  },
  active: {
    '& svg': {
      color: palette.text.primary,
    },
  },
})

export default MuiTableSortLabel
