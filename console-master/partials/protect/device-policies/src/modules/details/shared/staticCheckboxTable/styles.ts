import type { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'

const getCellStyles = (theme: Theme) => ({
  padding: `0px ${theme.spacing(6)}px`,
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',

  '&:first-child': {
    paddingRight: '0px',
  },

  '&:last-child': {
    paddingLeft: '0px',
    justifyContent: 'center',
  },
})

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  headCell: getCellStyles(theme),
  bodyCell: {
    ...getCellStyles(theme),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}))

export default useStyles
