import type { FabProps, PropTypes, Size } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import { ResponsiveDrawerMode, useResponsiveDrawerMode, useResponsiveDrawerState } from './ResponsiveDrawerProvider'
import type { ResponsiveDrawerTheme } from './theme'

const useStyles = makeStyles<ResponsiveDrawerTheme>(
  theme => ({
    root: {
      position: 'fixed',
      margin: theme.spacing(2),
      zIndex: theme.zIndex.floatingMenuButton || theme.zIndex.appBar + 1,
      color: theme.overrides.MuiResponsiveDrawer.paper.color,
      backgroundColor: theme.overrides.MuiResponsiveDrawer.paper.backgroundColor,
    },
  }),
  { name: 'MuiResponsiveDrawerFloatingButton' },
)

export const useResponsiveDrawerFloatingButton = (): Partial<FabProps> => {
  const mode = useResponsiveDrawerMode()
  const { toggleState } = useResponsiveDrawerState()
  const classes = useStyles()

  if (mode !== ResponsiveDrawerMode.MODAL) {
    return null
  }

  return {
    color: 'inherit' as PropTypes.Color,
    size: 'medium' as Size,
    'aria-label': 'Menu',
    onClick: toggleState,
    className: classes.root,
  }
}
