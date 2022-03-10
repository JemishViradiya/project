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

const DashboardContent = memo(() => {
  const theme = useTheme()
  const showActions = useMediaQuery(theme.breakpoints.up('md'))
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
