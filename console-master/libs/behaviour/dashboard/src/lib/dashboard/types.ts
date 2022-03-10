/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { DashboardProps as DashboardPropsBase } from '@ues-data/dashboard'
import { DisplayableError } from '@ues-data/shared-types'
import type { HelpLinks } from '@ues/assets'

export type {
  DashboardTime,
  AvailableOptions,
  CardProperties,
  CardState,
  ChartLibrary,
  ChartProps,
  CurrentOptions,
  DrilldownProps,
  LayoutItem,
} from '@ues-data/dashboard'

export { ChartType, TimeIntervalId } from '@ues-data/dashboard'
export { ActionType, getInitialGlobalTime } from '@ues-data/dashboard-config'

export const DEFAULT_DASHBOARD_ID = 'defaultDB'

export const DELETED_DASHBOARD_ID = 'deletedDB'

export enum ErrorCode {
  DASHBOARD_NOT_FOUND = 'DASHBOARD_NOT_FOUND',
  DASHBOARD_ERROR = 'DASHBOARD_ERROR',
}

export interface CardComponentState {
  noPermission?: boolean
  noData?: boolean
  error?: string
}

export interface DashboardProps extends DashboardPropsBase {
  helpLink?: HelpLinks
}

/**
 * Dashboard layout props.
 */
export interface DashboardLayoutHookProps {
  /**
   * Current breakpoint.
   */
  breakpoint?: string

  /**
   * Grid item row height.
   */
  rowHeight?: number

  /**
   * Margin between cards.
   */
  margin?: number

  /**
   * Grid layout container padding.
   */
  padding?: number
}

/**
 * Error thrown when chart has no data
 */
export class NoDataError extends DisplayableError {
  constructor(cause?: Error) {
    super(cause, `No data`, true)
  }
}

/**
 * Generic chart error
 */
export class GenericDashboardError extends DisplayableError {}
