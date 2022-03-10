const MuiSvgIcon = ({ spacing, palette }) => ({
  root: {
    '&.popover-chip-caret-down': {
      marginRight: `-${spacing(1)}px`,
      marginLeft: `${spacing(2)}px`,
      height: `${spacing(4)}px`,
      width: `${spacing(4)}px`,
      color: palette.logicalGrey[600],
    },
  },
})

export default MuiSvgIcon
