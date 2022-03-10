import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router'

import { UesSessionApi, UesSessionBackendType } from '@ues-data/shared'

import { SessionLoading } from '../components/Loading'

const SelectTenant = React.lazy(() => import('../views/SelectTenant'))
const SessionExpired = React.lazy(() => import('../views/SessionExpired'))
const LauncherSession = React.lazy(() => import('../views/LauncherSession'))
const VenueSession = React.lazy(() => import('../views/VenueSession'))
const VtxSession = React.lazy(() => import('../views/VtxSession'))
const SmgrSession = React.lazy(() => import('../views/SmgrSession'))

const loading = <SessionLoading />

const AppRoutes = (): JSX.Element => {
  const defaultView = <Navigate to={UesSessionBackendType} />

  return (
    <Routes>
      <Route path="/loading" element={loading} />
      <Route path="/vtx" element={<VtxSession redirect={false} loading={loading} />} />
      <Route path="/venue" element={<VenueSession redirect={false} loading={loading} />} />
      <Route path="/launcher" element={<LauncherSession redirect={false} loading={loading} />} />
      <Route path="/select-tenant" element={<SelectTenant />} />
      <Route path="/session-expired" element={<SessionExpired to="/" />} />
      <Route path="/session-mgr" element={<SmgrSession redirect={false} loading={loading} />} />
      <Route path="/*" element={defaultView} />
    </Routes>
  )
}

const NavigateRedirect = ({ tenant: tenantProp = undefined, target = UesSessionApi.SessionStartUrl }) => {
  const navigate = useNavigate()
  const { tenant: tenantParam } = useParams()
  const tenant = tenantProp || tenantParam
  useEffect(() => {
    if (tenant) {
      window.location.href = target(tenant)
    } else {
      navigate('/select-tenant')
    }
  }, [navigate, tenant, target])
  return <SessionLoading />
}

const getTenantFromUrl = () => {
  const params = new URLSearchParams(window.location.search.slice(1))
  return params.get('tenant')
}

const DefaultView = () => {
  switch (window.location.pathname) {
    case '/uc/session/launcher/login':
    case '/admin/index.jsp':
      return <LauncherSession loading={loading} tenantParam={getTenantFromUrl()} />
    case '/uc/session/launcher/logout':
      return <NavigateRedirect tenant={getTenantFromUrl()} target={UesSessionApi.SessionLogoutUrl} />
    case '/uc/session/venue':
      return <VenueSession loading={loading} />
    case '/uc/session/vtx':
      return <VtxSession loading={loading} />
    default:
      return <AppRoutes />
  }
}

export default <DefaultView />
