/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import {
  AddWidgetsDrawer,
  DashboardActions,
  DashboardHeader,
  DashboardLayout,
  DashboardProvider,
  DrillDownDrawer,
  TimeSelect,
  useDashboard,
  useGlobalTimeSelect,
} from '@ues-behaviour/dashboard'

import { outOfBoxConfigs } from './outOfBoxConfigs'

const DashboardMain = memo(() => {
  const theme = useTheme()
  const showActions = useMediaQuery(theme.breakpoints.up('md'))
  const { containerProps, addWidgetsDrawerOpen, drillDownOpen, setDrillDownOpen } = useDashboard()

  return (
    <>
      <div {...containerProps}>
        <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
          <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
          {showActions && <DashboardActions outOfBoxConfigs={outOfBoxConfigs} />}
        </DashboardHeader>
        <DashboardLayout />
      </div>
      {showActions && <AddWidgetsDrawer />}
      <DrillDownDrawer open={drillDownOpen} setOpen={setDrillDownOpen} />
    </>
  )
})

const DashboardTemplate = memo((dashboardProps: DashboardProps) => {
  return (
    <DashboardProvider dashboardProps={dashboardProps}>
      <DashboardMain />
    </DashboardProvider>
  )
})

export default DashboardTemplate

DashboardTemplate.displayName = 'DashboardTemplate'
