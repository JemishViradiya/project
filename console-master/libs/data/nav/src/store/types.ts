/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export const ReduxSlice = 'uc.nav'

export type NavAppsState = {
  navApps?: NavigationApps
  updateApps?: boolean
}

export type Navigation = {
  name: string
  route?: string
  match?: string
  navigation?: Navigation[]
}

export type NavigationApps = {
  publicPath: string
  navigation: Navigation[]
}

export const ActionType = {
  FetchNavAppsStart: `${ReduxSlice}/fetch-start`,
  FetchNavAppsError: `${ReduxSlice}/fetch-error`,
  FetchNavAppsSuccess: `${ReduxSlice}/fetch-success`,
  UpdateNavApps: `${ReduxSlice}/update-apps`,
}
