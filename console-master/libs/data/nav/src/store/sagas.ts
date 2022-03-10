/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, takeLeading } from 'redux-saga/effects'

import { ConsoleApi, UES_ENV } from '@ues-data/network'
import { FeatureName, getSiteBase, resolveOverrideEnvironmentVariable, UesAxiosClient, UesSessionApi } from '@ues-data/shared'

import type { FetchNavAppsReturnType } from './actions'
import { fetchFeaturesError, fetchNavAppsSuccess } from './actions'
import { ActionType } from './types'

const NavApi = {
  getApps: async refetch => {
    const token = UesSessionApi.getTokenVenue()
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    if (refetch) headers['Cache-Control'] = 'max-age=0'
    const navApps = await UesAxiosClient().get(`${ConsoleApi.apiResolver()}navigation`, { headers })
    return navApps.data
  },
}

const getApps = apps => {
  const mockReviewSite = window.location.origin.includes('ues-console-sites.sw.rim.net')
  const stagingReviewSite = window.location.pathname.includes('uc/.stage/')
  if (mockReviewSite || stagingReviewSite) {
    let appsStr = JSON.stringify(apps)
    appsStr = appsStr.replace(/"route":"\/uc\//g, `"route":"${getSiteBase()}uc/`)
    appsStr = appsStr.replace(/"match":"\/uc\//g, `"match":"${getSiteBase()}uc/`)
    return JSON.parse(appsStr)
  }
  return apps
}

export const fetchAppsSaga = function* (): Generator {
  yield takeLeading<FetchNavAppsReturnType>(ActionType.FetchNavAppsStart, function* ({ payload: { mock, refetch } }) {
    try {
      if (mock || UES_ENV === 'DEV') {
        const appsJson = resolveOverrideEnvironmentVariable(FeatureName.SingleNXApp).enabled
          ? 'apps.console'
          : resolveOverrideEnvironmentVariable(FeatureName.UESCronosNavigation).enabled
          ? 'apps.cronos'
          : 'apps'
        const apps = yield fetch(`uc/api/ui/${appsJson}`)
          .then(resp => resp.json())
          .then(result => {
            return result
          })
        yield put(fetchNavAppsSuccess(getApps(apps)))
      } else {
        const apps = yield call(NavApi.getApps, refetch)
        yield put(fetchNavAppsSuccess(getApps(apps)))
      }
    } catch (error) {
      yield put(fetchFeaturesError(error as Error))
    }
  })
}

export const rootSaga = function* (): Generator {
  yield all([call(fetchAppsSaga)])
}
