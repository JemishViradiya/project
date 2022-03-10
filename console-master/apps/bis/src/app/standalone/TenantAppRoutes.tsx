import React, { lazy, memo } from 'react'
import { Navigate, useRoutes } from 'react-router'

import { GeneralSettings } from '@ues-bis/standalone-settings-general'
import { RiskEnginesSettings } from '@ues-bis/standalone-settings-risk-engines'
import { useClientParams } from '@ues-bis/standalone-shared'

const Home = lazy(() => import('../../views/dashboard'))
const EventInfo = lazy(() => import('../../views/eventInfo'))
const Events = lazy(() => import('../../views/events'))
const Geozones = lazy(() => import('../../views/geozones'))
const IpAddresses = lazy(() => import('../../views/settingsIpAddresses'))
const Policies = lazy(() => import('../../views/policies'))
const PolicyCreation = lazy(() => import('../../views/policies/creation'))
const PolicyInfo = lazy(() => import('../../views/policyInfo'))
const PolicyRank = lazy(() => import('../../views/policyRank'))

const UserInfo = lazy(() => import('../../views/userInfo'))
const Users = lazy(() => import('../../views/users'))

const getRoutes = (ipAddressRisk: boolean) => [
  { path: '/dashboard', element: <Home /> },
  { path: '/events', element: <Events /> },
  { path: '/events/:id', element: <EventInfo /> },
  { path: '/users', element: <Users /> },
  { path: '/users/:id', element: <UserInfo /> },
  { path: '/policies', element: <Policies /> },
  { path: '/policies/create', element: <PolicyCreation /> },
  { path: '/policies/rank', element: <PolicyRank /> },
  { path: '/policies/:id/*', element: <PolicyInfo /> },
  { path: '/settings', element: <Navigate to="/settings/general" /> },
  RiskEnginesSettings,
  GeneralSettings,
  { path: '/settings/ip-addresses/*', element: ipAddressRisk ? <IpAddresses /> : null },
  { path: '/settings/geozones', element: <Geozones /> },
  { path: '/*', element: <Navigate to="/dashboard" /> },
]

const useResolvedRoutes = () => {
  const { features: { IpAddressRisk } = { IpAddressRisk: false } } = useClientParams()
  return getRoutes(IpAddressRisk)
}

const StandaloneTenantAppRoutes = memo(() => {
  const routes = useResolvedRoutes()

  return useRoutes(routes)
})

export default StandaloneTenantAppRoutes
