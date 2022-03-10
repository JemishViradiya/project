/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react'

import type { TypographyVariant } from '@material-ui/core'
import { alpha, Button, Drawer, Fab, ListItemText, makeStyles } from '@material-ui/core'

import { BasicMenu as MenuIcon, BrandCylance } from '@ues/assets'

import { ResponsiveDrawerMode, useResponsiveDrawerMode } from './ResponsiveDrawerProvider'
import type { ResponsiveDrawerTheme } from './theme'
import { useResponsiveDrawer } from './useResponsiveDrawer'
import { useResponsiveDrawerButton } from './useResponsiveDrawerButton'
import { useResponsiveDrawerFloatingButton } from './useResponsiveDrawerFloatingButton'

const primaryTypographyProps = { variant: 'h2' as TypographyVariant }

const createShadow = (color, shadows, ...px) => {
  return [
    `0px ${px[0]}px ${px[1]}px ${px[2]}px ${alpha(color, shadows.umbraOpacity)}`,
    `0px ${px[0] * 2}px ${px[1] * 2}px ${px[2]}px ${alpha(color, shadows.penumbraOpacity)}`,
    `0px ${px[0]}px ${px[1] * 3}px ${px[2]}px ${alpha(color, shadows.ambientShadowOpacity)}`,
  ].join(',')
}

export const useResponsiveDrawerStyles = makeStyles<ResponsiveDrawerTheme, { mode: ResponsiveDrawerMode }>(
  theme => ({
    '@global': {
      main: {
        flexGrow: 1,
        padding: theme.spacing(3),
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('lg')]: {
        display: 'none',
      },
    },
    root: {
      display: 'flex',
      width: '100%', // Avoid horizontal scrollbar on vertical overflow
      height: '100vh',
      flexFlow: 'row nowrap',
    },
    logoText: (props: { mode: ResponsiveDrawerMode }) => ({
      minWidth: 'max-content',
      margin: 0,
      flex: 'none',
      boxShadow: createShadow(theme.props['colors'].nav.background, theme.palette['shadows'], 4, 4, 1),
      zIndex: 1,
      paddingLeft: theme.spacing(4),
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
    expandButtonPanel: {
      display: 'flex',
      flexDirection: 'column',
      boxShadow: createShadow(theme.props['colors'].nav.background, theme.palette['shadows'], -4, 4, 1),
      zIndex: 1,
      padding: theme.spacing(1),
    },
    topPanel: (props: { mode: ResponsiveDrawerMode }) => ({
      display: 'flex',
      height: theme.overrides.MuiResponsiveDrawer.mini.width,
      marginTop: theme.spacing(props.mode === ResponsiveDrawerMode.INLINE ? 1 : 2),
      marginBottom: theme.spacing(1.5),
      padding: `${theme.spacing(3) - 1}px ${theme.spacing(3)}px`,
      alignItems: 'baseline',
      justifyContent: 'center',
    }),
    logo: {
      '&.MuiSvgIcon-root': {
        fontSize: '28px',
        width: '28px',
        height: '34px',
        color: theme.props.colors.cyGreen[500],
      },
    },
  }),
  {
    name: 'MuiResponsiveDrawerRoot',
  },
)

export interface ResponsiveDrawerProps {
  nav?: React.ReactChildren | React.ReactChild
  content?: React.ReactChildren | React.ReactChild
  responsive?: boolean
  logo?: React.ElementType<React.SVGProps<SVGSVGElement>>
  title?: React.ReactChild
}

export const ResponsiveDrawer = React.memo(
  ({ nav, content, responsive = false, logo: Logo = BrandCylance, title = 'BlackBerry UES' }: ResponsiveDrawerProps) => {
    const mode = useResponsiveDrawerMode()
    const responsiveDrawerProps = useResponsiveDrawer()
    const buttonProps = useResponsiveDrawerButton()
    const fabProps = useResponsiveDrawerFloatingButton()
    const classes = useResponsiveDrawerStyles({ mode: mode })

    return (
      <div className={classes.root}>
        {responsive && fabProps && (
          <Fab {...fabProps}>
            <MenuIcon color="inherit" />
          </Fab>
        )}
        <Drawer role="navigation" {...responsiveDrawerProps}>
          <div className={classes.topPanel}>
            <Logo color="inherit" className={classes.logo} />
            {mode === ResponsiveDrawerMode.MODAL && <Button variant="contained" {...buttonProps} />}
          </div>
          {responsive && (
            <ListItemText
              primary={title}
              primaryTypographyProps={primaryTypographyProps}
              className={classes.logoText}
              style={{ opacity: responsiveDrawerProps.open ? 1 : 0 }}
            />
          )}
          {nav}
          {mode === ResponsiveDrawerMode.INLINE && (
            <div className={classes.expandButtonPanel}>
              <Button variant="contained" {...buttonProps} />
            </div>
          )}
        </Drawer>
        {content}
      </div>
    )
  },
)
