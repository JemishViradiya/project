/* eslint-disable sonarjs/no-duplicate-string */
/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'

import { Drawer, makeStyles } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'

import { AddWidgetsContent } from './AddWidgetsContent'
import { useDashboardWidgets } from './DashboardProvider'
import { DRAWER_WIDTH as ADD_WIDGETS_WIDTH } from './utils'

const DashboardAddWidgetsPaperProps = { elevation: 0, right: -ADD_WIDGETS_WIDTH }
const DashboardAddWidgetsPaperPropsOpen = { elevation: 0, right: 0 }

const useStyles = makeStyles<UesTheme>(
  theme => ({
    drawer: {
      flexShrink: 0,
      flexGrow: 0,
      transition: theme.transitions.create('box-shadow'),
      zIndex: theme.zIndex.drawer,
    },
    paper: {
      overflow: 'hidden',
      backgroundColor: theme.palette.background.body,
      position: 'relative',
      border: 'none !important',
      transition: ([
        theme.transitions.create(['width', 'box-shadow', 'border'], {
          delay: 36,
          // easing: 'linear',
        }),
        '!important',
      ] as unknown) as React.CSSProperties['transition'],
    },
    drawerClosed: {
      boxShadow: theme.shadows[1],
      '& $paper': {
        width: 0,
        transition: theme.transitions.create('left'),
        borderLeftColor: 'transparent',
      },
    },
    drawerOpen: {
      boxShadow: theme.shadows[3],
      '& $paper': {
        width: ADD_WIDGETS_WIDTH,
        transition: theme.transitions.create('left'),
        borderLeftColor: theme.palette.divider,
        marginRight: 'unset',
      },
    },
    container: {
      width: ADD_WIDGETS_WIDTH,
      maxHeight: '100%',
      minHeight: '100%',
      borderLeft: `1px solid ${theme.palette.divider}`,
      overflowY: 'auto',
    },
  }),
  {
    name: 'AddWidgetsDrawer',
  },
)

export const AddWidgetsDrawer = (): JSX.Element => {
  const { addWidgetsDrawerOpen } = useDashboardWidgets()
  const { drawer, drawerOpen, drawerClosed, paper, container } = useStyles()

  const classes = useMemo(
    () => ({
      root: `${drawer} ${addWidgetsDrawerOpen ? drawerOpen : drawerClosed}`,
      paper,
    }),
    [addWidgetsDrawerOpen, drawer, drawerClosed, drawerOpen, paper],
  )
  const PaperProps = addWidgetsDrawerOpen ? DashboardAddWidgetsPaperPropsOpen : DashboardAddWidgetsPaperProps

  const SlideProps = {
    // mountOnEnter: true,
    // unmountOnExit: true,
  }

  return (
    <Drawer open variant="persistent" anchor="right" classes={classes} PaperProps={PaperProps} SlideProps={SlideProps}>
      <div className={container} role="menubar">
        <AddWidgetsContent />
      </div>
    </Drawer>
  )
}
