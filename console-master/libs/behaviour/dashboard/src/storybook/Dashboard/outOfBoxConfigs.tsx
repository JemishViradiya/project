/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { DashboardProps } from '@ues-behaviour/dashboard'
import { DEFAULT_TIME_INTERVAL, getInitialGlobalTime } from '@ues-behaviour/dashboard'

export const outOfBoxConfigs: DashboardProps[] = [
  {
    id: 'outOfBox1',
    title: 'Out of box 1',
    globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL),
    layoutState: [
      { i: 'card1', x: 0, y: 0, w: 6, h: 5 },
      { i: 'card2', x: 6, y: 0, w: 6, h: 5 },
      { i: 'card3', x: 0, y: 6, w: 12, h: 5 },
    ],
    cardState: {
      card1: {
        chartId: 'chart1',
      },
      card2: {
        chartId: 'chart2',
      },
      card3: {
        chartId: 'chart3',
      },
    },
  },
  {
    id: 'outOfBox2',
    title: 'Out of box 2',
    globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL),
    layoutState: [
      { i: 'card4', x: 0, y: 5, w: 6, h: 7 },
      { i: 'card5', x: 6, y: 5, w: 18, h: 7 },
      { i: 'card9', x: 0, y: 19, w: 6, h: 7 },
    ],
    cardState: {
      card4: {
        chartId: 'chart4',
        options: {
          totalCount: true,
          customTime: 'last90Days',
        },
      },
      card5: {
        chartId: 'chart5',
        options: { customTime: 'last7Days', dataZoom: false, groupBy: '24' },
      },
      card9: {
        chartId: 'chart9',
        options: { groupBy: '1' },
      },
    },
  },
]
