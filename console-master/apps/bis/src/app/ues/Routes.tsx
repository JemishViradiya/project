import React, { memo } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router'
import { useRoutes } from 'react-router-dom'

import { AdaptiveResponseSettings } from '@ues-bis/adaptive-response-settings'
import { GeneralSettings } from '@ues-bis/standalone-settings-general'

import styles from '../../app-shell/AppShell.module.less'

const Placeholder = () => {
  console.log(styles)
  return <div>Loaded - use some defined routes just for testing</div>
}

const UES_ROUTES: PartialRouteObject[] = [
  { path: '/', element: <Placeholder /> },
  AdaptiveResponseSettings,
  GeneralSettings,
  { path: '/*', element: () => <Navigate to={'/'} /> },
]

const UesRoutes = memo(() => {
  return useRoutes(UES_ROUTES)
})

export default UesRoutes
