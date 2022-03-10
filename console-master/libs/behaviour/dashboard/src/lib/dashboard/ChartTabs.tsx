/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'
import React, { memo } from 'react'

export interface ChartTabsProps {
  currentTabIndex: number
  handleTabChange: (event: React.ChangeEvent<unknown>, newIndex: number) => void
  children?: ReactNode
}

type ChartTabPanelProps = {
  children?: ReactNode
  index: unknown
  value: unknown
}

export const ChartTabPanel = memo((props: ChartTabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div hidden={value !== index} id={`chartTabpanel-${index}`} {...other}>
      {value === index && children}
    </div>
  )
})
