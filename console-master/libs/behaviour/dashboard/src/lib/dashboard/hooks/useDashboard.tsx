/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { HTMLAttributes } from 'react'

import { useDashboardWidgets } from './../DashboardProvider'

export type useDashboardProps = {
  containerProps: HTMLAttributes<HTMLDivElement>
  addWidgetsDrawerOpen: boolean
  drillDownOpen: boolean
  setDrillDownOpen: (boolean) => void
  drillDownContext: unknown
  setDrillDownContext: (unknown) => void
}

const containerProps = {
  'data-testid': 'dashboard-main',
  style: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column nowrap',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '100%',
  } as React.CSSProperties,
}

export const useDashboard = (): useDashboardProps => {
  const { addWidgetsDrawerOpen, drillDownOpen, setDrillDownOpen, drillDownContext, setDrillDownContext } = useDashboardWidgets()

  return {
    containerProps,
    addWidgetsDrawerOpen,
    drillDownOpen,
    setDrillDownOpen,
    drillDownContext,
    setDrillDownContext,
  }
}
