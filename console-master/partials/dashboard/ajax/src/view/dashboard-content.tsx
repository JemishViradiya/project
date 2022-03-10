//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import { useMediaQuery, useTheme } from '@material-ui/core'

import {
  AddWidgetsDrawer,
  DashboardActions,
  DashboardHeader,
  DashboardLayout,
  DrillDownDrawer,
  TimeSelect,
  useDashboard,
  useGlobalTimeSelect,
} from '@ues-behaviour/dashboard'

export interface DashboardLayoutProps {
  editable?: boolean
}

const DashboardContent = memo(({ editable = true }: DashboardLayoutProps) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const showActions = editable && matches
  const { addWidgetsDrawerOpen, drillDownOpen, containerProps, setDrillDownOpen } = useDashboard()

  return (
    <>
      <div {...containerProps}>
        <DashboardHeader widgetDrawerOpen={addWidgetsDrawerOpen}>
          <TimeSelect testid={'globalTime'} {...useGlobalTimeSelect()} />
          {showActions && <DashboardActions />}
        </DashboardHeader>
        <DashboardLayout />
      </div>
      {showActions && <AddWidgetsDrawer />}
      <DrillDownDrawer open={drillDownOpen} setOpen={setDrillDownOpen} />
    </>
  )
})

export default DashboardContent
