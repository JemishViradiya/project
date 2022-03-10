const MuiTablePagination = ({ palette, spacing }) => ({
  root: {
    color: palette.text.secondary,
  },
  select: {
    color: palette.text.primary,
  },
  selectIcon: {
    color: palette.text.secondary,
  },
  spacer: {
    flex: '1 1 1px',
  },
  toolbar: {
    padding: `${spacing(4)}px ${spacing(6)}px`,
    paddingRight: `${spacing(6)}px`,
    minHeight: 'auto',
  },
  caption: {
    display: 'flex',
  },
})

export default MuiTablePagination
