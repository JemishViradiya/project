import type { DashboardTime, TimeIntervalId } from '@ues-data/dashboard'

import { ActionType } from './types'

export function initialize(payload) {
  return { type: ActionType.INITIALIZE_STATE, payload }
}

export function getInitialGlobalTime(timeInterval: TimeIntervalId, nowTime: Date = new Date()): DashboardTime {
  return { timeInterval, nowTime }
}

export function isOutOfBoxDashboard(id: string, title: string): boolean {
  return (
    (id.endsWith('Dashboard') && id === title) ||
    // UES-6488 hack - allow users with older oob configs to localize & customize titles:
    (id === 'networkDashboard' && title === 'Network') ||
    (id === 'protectMobileDashboard' && title === 'Protect Mobile')
  )
}

export function isNewDashboard(title: string): boolean {
  return title === 'newEmptyDashboard'
}
