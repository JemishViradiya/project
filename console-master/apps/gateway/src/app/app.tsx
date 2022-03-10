//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { GatewayEvidenceAlertsTransition } from '@ues-bis/gateway-evidence'
import { useFeatures } from '@ues-data/shared'
import { GatewayEvents } from '@ues-gateway/events'
import { Loading } from '@ues/behaviours'

import useStyles from './styles'

const loading = { path: '/loading', element: <Loading /> }
const fallback = { path: '/*', element: <Navigate to="/events" /> }

const AppRoutes = memo(() => {
  const { isEnabled } = useFeatures()

  const classes = useStyles()
  const routes = useRoutes([loading, GatewayEvents, GatewayEvidenceAlertsTransition, fallback])

  return <main className={classes.container}>{routes}</main>
})

export default <AppRoutes />
