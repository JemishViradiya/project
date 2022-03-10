/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { NavAppsState } from './types'
import { ReduxSlice } from './types'

function getDashNavIds(state, prefix) {
  const navigation = state?.navApps?.navigation
  if (navigation) {
    const dashboardItem = navigation.filter(item => item.name === 'dashboard')[0]
    const dashboardNav = dashboardItem?.navigation
    if (dashboardNav) {
      return dashboardNav.reduce((result, item) => {
        const customDashRoute = item.route
        if (customDashRoute?.includes(prefix)) {
          result.push(customDashRoute.substr(customDashRoute.indexOf(prefix) + prefix.length))
        }
        return result
      }, [])
    }
  }
  return undefined
}

const getState = (state: { [k in typeof ReduxSlice]: NavAppsState }) => state[ReduxSlice]

export const getApps = createSelector(getState, state => state?.navApps ?? undefined)

export const getUpdateApps = createSelector(getState, state => state?.updateApps ?? false)

export const getDashboardNavIds = prefix => createSelector(getState, state => getDashNavIds(state, prefix))
