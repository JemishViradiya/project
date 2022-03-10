/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { IsFeatureEnabled } from '@ues-data/shared'
import type { Permission, ServiceId } from '@ues-data/shared-types'

export interface DashboardTime {
  timeInterval: TimeIntervalId
  nowTime: Date
}

/**
 * Map of card id to card props.
 */
export interface CardState {
  [key: string]: CardProperties
}

/**
 * Card props.
 */
export interface CardProperties {
  /**
   * Chart component id.
   */
  chartId: string

  /**
   * Current chart options.
   */
  options?: CurrentOptions
}

/**
 * Current chart options and their current values.
 */
export interface CurrentOptions {
  [key: string]: unknown
}

/**
 * Chart props.
 */
export interface ChartProps {
  id: string
  chartId: string
  width: number
  height: number
  globalTime?: DashboardTime
  chartType?: ChartType
  childProps?: unknown[]
}

export enum ChartType {
  Bar = 'bar',
  Column = 'column',
  Count = 'count',
  Donut = 'donut',
  Line = 'line',
  Pie = 'pie',
  Toplist = 'toplist',
  Map = 'map',
}

/**
 * Drilldown props.
 */
export interface DrilldownProps {
  chartId: string
  context?: unknown
}

/**
 * Menu options available for a chart.
 */
export interface AvailableOptions {
  [key: string]: boolean
}

/**
 * Grid layout item props.
 */
export interface LayoutItem {
  /**
   * A string corresponding to the card id.
   */
  i: string

  /**
   * X position in grid units.
   */
  x: number

  /**
   * Y position in grid units.
   */
  y: number

  /**
   * Width in grid units.
   */
  w: number

  /**
   * Height in grid units.
   */
  h: number

  /**
   * Minimum width in grid units.
   */
  minW?: number

  /**
   * Maximum width in grid units.
   */
  maxW?: number

  /**
   * Minimum height in grid units.
   */
  minH?: number

  /**
   * Maximum height in grid units.
   */
  maxH?: number

  /**
   * If true, equal to `isDraggable: false` and `isResizable: false`. Default: false.
   */
  static?: boolean

  /**
   * If false, will not be draggable. Overrides `static`. Default: true.
   */
  isDraggable?: boolean

  /**
   * If false, will not be resizable. Overrides `static`. Default: true.
   */
  isResizable?: boolean
}

/**
 * Dashboard prop.
 */
export interface DashboardProps {
  /**
   * Dashboard id.
   */
  id: string

  /**
   * Dashboard title.
   */
  title: string | Array<string>

  /**
   * Global time.
   */
  globalTime: DashboardTime

  /**
   * Mapping of breakpoints to layout items.
   */
  layoutState: Array<LayoutItem>

  /**
   *  Map of card id to card props.
   */
  cardState: CardState

  /**
   * Map of chart id to jsx object and available menu options.
   */
  chartLibrary?: ChartLibrary

  /**
   * If true, charts are removable.
   */
  chartsRemovable?: boolean

  /**
   * If true, data will not be persisted.
   */
  nonPersistent?: boolean

  /**
   * If true, dashboard will be editable.
   */
  editable?: boolean

  /**
   * List of services required to display this dashboard
   */
  requiredServices?: Array<string>

  /**
   * Dashboard error
   */
  error?: Error
}

/**
 * Map of chart id to jsx object, chart info, and available options.
 */
export interface ChartLibrary {
  [key: string]: {
    /**
     * card title
     */
    title: string

    /**
     * By default card title is displayed.
     * If false, title will not be displayed in card but will be displayed in Add Widgets component.
     */
    showCardTitle?: boolean

    /**
     * default height in grid units
     */
    defaultHeight: number

    /**
     * default width in grid units
     */
    defaultWidth: number

    /**
     * chart component to render
     */
    component: React.ComponentType<ChartProps>

    /**
     * drilldown component
     */
    drilldownComponent?: React.ComponentType<DrilldownProps>

    /**
     * chart type
     */
    chartType: ChartType

    /**
     * Feature to check before displaying component card
     */
    features?: (isEnabled: IsFeatureEnabled) => boolean

    /**
     * Permissions to be checked for component
     */
    permissions?: Permission[]

    /**
     * Services to be checked for component
     */
    services?: ServiceId[]

    /**
     * chart category (used for grouping)
     */
    category?: string

    /**
     * Available menu options.
     * Options available for this chart will be 'true'.
     */
    availableOptions?: AvailableOptions
  }
}

export interface DashboardState {
  id: string
  title: string
  globalTime: string
  cardState: string
  layoutState: string
}

export default void 0

export enum TimeIntervalId {
  Last24Hours = 'last24Hours',
  Last2Days = 'last2Days',
  Last7Days = 'last7Days',
  Last30Days = 'last30Days',
  Last60Days = 'last60Days',
  Last90Days = 'last90Days',
  Last120Days = 'last120Days',
  Today = 'today',
  Yesterday = 'yesterday',
  ThisWeek = 'thisWeek',
  LastWeek = 'lastWeek',
  ThisMonth = 'thisMonth',
  LastMonth = 'lastMonth',
  Last2Months = 'last2Months',
  Last3Months = 'last3Months',
}

export const DEFAULT_TIME_INTERVAL = TimeIntervalId.Last24Hours

export const Month = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]
