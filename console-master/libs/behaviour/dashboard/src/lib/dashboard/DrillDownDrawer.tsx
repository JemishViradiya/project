/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Icon from '@material-ui/core/SvgIcon'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { BasicClose } from '@ues/assets'

import { useDashboardWidgets } from './DashboardProvider'
import { selectChartLibrary } from './store'

type DrillDownDrawerProps = {
  open: boolean
  setOpen: (boolean) => void
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 575,
  },
  drawerPaperFull: {
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(2),
  },
  drillDownContainer: {
    height: `calc(100% - ${theme.spacing(6)}px)`,
  },
  flexiblePanel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: theme.spacing(3),
  },
}))

export const DrillDownDrawer = memo(({ open, setOpen }: DrillDownDrawerProps) => {
  const theme = useTheme()
  const isFull = !useMediaQuery(theme.breakpoints.up('md'))

  const styles = useStyles()

  // close drawer when modal area is clicked
  const closeDrawer = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setOpen(false)
  }

  const chartLibrary = useSelector(selectChartLibrary)
  const { drillDownContext } = useDashboardWidgets()

  const Content = open ? chartLibrary[drillDownContext.chartId].drilldownComponent : null

  // if (!Content) return null

  return (
    <Drawer
      classes={{ paper: isFull ? styles.drawerPaperFull : styles.drawerPaper }}
      anchor="right"
      open={open}
      onClose={closeDrawer}
    >
      <div role="presentation" className={styles.drillDownContainer}>
        <IconButton size={'small'} className={styles.closeIcon} aria-label="close" onClick={() => setOpen(false)}>
          <Icon component={BasicClose} />
        </IconButton>
        <div className={styles.flexiblePanel}>{Content && <Content {...drillDownContext} />}</div>
      </div>
    </Drawer>
  )
})
