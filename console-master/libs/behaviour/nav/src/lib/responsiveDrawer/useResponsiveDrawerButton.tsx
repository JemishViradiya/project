import React from 'react'

import type { ButtonProps, Size } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import { ArrowNavPanelOpen } from '@ues/assets'

import type { ResponsiveDrawerMode } from './ResponsiveDrawerProvider'
import { useResponsiveDrawerMode, useResponsiveDrawerState } from './ResponsiveDrawerProvider'
import type { ResponsiveDrawerTheme } from './theme'

const useStyles = makeStyles<ResponsiveDrawerTheme, { open: boolean; mode: ResponsiveDrawerMode; responsive: boolean }>(
  theme => ({
    iconSizeLarge: {
      fontSize: theme.overrides.MuiResponsiveDrawerButton.root.width,
      transition: props =>
        theme.transitions.create('trnsform', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration[props.open ? 'enteringScreen' : 'leavingScreen'],
        }),
      willChange: 'transform',
      transform: props => (props.open ? 'scaleX(-1)' : 'scaleX(1)'),
    },
    root: {
      display: props => (props.responsive ? undefined : 'none'),
      '&.MuiButton-root': {
        marginLeft: 'auto',
        minWidth: theme.overrides.MuiResponsiveDrawer.mini.width - theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        color: 'inherit',
        backgroundColor: 'inherit',
        '&:hover': {
          backgroundColor: theme.props['colors'].nav.itemHover,
        },
      },
    },
  }),
  { name: 'MuiResponsiveDrawerButton' },
)

export const useResponsiveDrawerButton = (props?: Partial<ButtonProps>): Partial<ButtonProps> => {
  const { open, toggleState, responsive } = useResponsiveDrawerState()
  const mode = useResponsiveDrawerMode()
  const classes = useStyles({ open: open, mode, responsive })

  const icon = <ArrowNavPanelOpen color="inherit" className={classes.iconSizeLarge} />
  return {
    'aria-label': 'Menu',
    disableElevation: true,
    variant: 'contained',
    size: 'large' as Size,
    onClick: toggleState,
    classes,
    children: icon,
    ...props,
  }
}
