import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    display: 'flex',
    position: 'absolute',
    width: spacing(113),
    marginLeft: spacing(4),
    marginTop: spacing(4),
    padding: spacing(8, 6),
    '&::before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: palette.background.default,
      opacity: 0.8,
      borderRadius: '2px',
    },
  },
  searchInput: {
    marginBottom: 0,
    flex: 1,
  },
  searchInputArea: {
    '&.MuiInputBase-root': {
      background: palette.grey[200],
    },
  },
  drawingControlsContainer: {
    display: 'flex',
    position: 'relative',
    background: palette.background.default,
    marginLeft: spacing(3),
    border: `1px solid ${palette.divider}`,
    borderRadius: '2px',
  },
  createCircleButton: {
    borderRight: `1px solid ${palette.divider}`,
  },
}))
