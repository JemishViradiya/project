/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ElementType } from 'react'

import { BasicMap, ChartBar, ChartColumn, ChartCount, ChartDonut, ChartLine, ChartPie, ChartTopList } from '@ues/assets'

import type { LayoutItem } from './types'
import { ChartType } from './types'

export { getInitialGlobalTime } from '@ues-data/dashboard-config'

export const DRAWER_WIDTH = 320

// used for sorting layout according to grid coordinates.
export function compareLayout(gridPosA: LayoutItem, gridPosB: LayoutItem): number {
  if (gridPosA.y > gridPosB.y) return 1
  if (gridPosB.y > gridPosA.y) return -1
  // y is equal, look at x
  if (gridPosA.x > gridPosB.x) return 1
  if (gridPosB.x > gridPosA.x) return -1
  return 0
}

export function getXSLayout(layout: Array<LayoutItem>): Array<LayoutItem> {
  // https://github.com/STRML/react-grid-layout/issues/913
  // 'Infinity' is not supported by JSON so we cannot use it for the layouts.
  const myInfinity = 9999999999
  const smLayout = []
  for (let n = 0; n < layout.length; n++) {
    const item = layout[n]
    const newLayout = { i: item.i, x: 0, y: myInfinity, w: 1, h: item.h }
    smLayout.push(newLayout)
  }
  return smLayout
}

export function chartIcon(chartType: ChartType): ElementType {
  if (chartType === ChartType.Bar) return ChartBar
  if (chartType === ChartType.Column) return ChartColumn
  if (chartType === ChartType.Count) return ChartCount
  if (chartType === ChartType.Donut) return ChartDonut
  if (chartType === ChartType.Line) return ChartLine
  if (chartType === ChartType.Pie) return ChartPie
  if (chartType === ChartType.Toplist) return ChartTopList
  if (chartType === ChartType.Map) return BasicMap

  return undefined
}
