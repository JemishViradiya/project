/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { ProtectMobileAlerts } from '@ues-mtd/alerts'
import { ProtectMobile } from '@ues-mtd/dashboard'
import { Loading } from '@ues/behaviours'

const loading = { path: '/loading', element: <Loading /> }

const ajaxRoutes = [loading]
const cronosRoutes = [loading, ProtectMobileAlerts, ...ProtectMobile]

export const AppRoutes = memo(() => {
  const features = useFeatures()
  const cronosNavigation = features.isEnabled(FeatureName.UESCronosNavigation)
  const routes = useRoutes(cronosNavigation ? cronosRoutes : ajaxRoutes)
  const location = useLocation()

  // HACK: because nav service in production is using mtd#/global-list
  // instead of console#/settings/global-list we need to replace the path
  // TODO: Remove once nav service has been updated
  useEffect(() => {
    const url = new URL(window.location.href)
    if (cronosNavigation && window.location.hash.includes('global-list')) {
      Object.assign(url, {
        pathname: url.pathname.replace('/uc/mtd', '/uc/console'),
        hash: url.hash.replace(`#/global-list`, `#/settings/global-list`),
      })
      window.location.replace(url.toString())
    }
  }, [cronosNavigation, location])

  return <main style={{ padding: 0, display: 'flex', flexDirection: 'row' }}>{routes}</main>
})

export default <AppRoutes />
