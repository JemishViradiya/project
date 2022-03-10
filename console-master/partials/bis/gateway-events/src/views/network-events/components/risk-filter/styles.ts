import makeStyles from '@material-ui/core/styles/makeStyles'

export const useStyles = makeStyles(theme => ({
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelCounter: {
    display: 'block',
    padding: theme.spacing(0, 1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    lineHeight: theme.typography.caption.lineHeight,
    fontSize: theme.typography.caption.fontSize,
    marginLeft: theme.spacing(2),
  },
}))
