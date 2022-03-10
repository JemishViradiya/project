import '../../auth/saga'
import '../../i18n'

import { parse } from 'query-string'
import React, { memo } from 'react'
import { useRoutes } from 'react-router-dom'

import { useMock } from '@ues-data/shared'

import LoggedOutView from '../../auth/components/LoggedOutView'
import LoginRedirect from '../../auth/components/LoginRedirect'
import SelectTenantView from '../../auth/components/SelectTenantView'
import usePrivateRoute from '../../components/hooks/usePrivateRoute'
import useTenant from '../../components/hooks/useTenant'
import Loading from '../../components/util/Loading'
import TenantApp from './TenantApp'

const Home = () => {
  let flavour = 'empty'
  let failedTenant
  // eslint-disable-next-line no-restricted-globals
  if (location.search) {
    // eslint-disable-next-line no-restricted-globals
    const search = parse(location.search)
    failedTenant = search.failedTenant
    if (failedTenant) {
      flavour = ''
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <SelectTenantView flavour={flavour} failedTenant={failedTenant} />
}

const LoggedOut = () => {
  const tenant = window.location.pathname.split('/')[1]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <LoggedOutView to={`/${tenant}`} />
}

const StandaloneApp = memo(() => {
  const { tenant } = useTenant()
  const mock = useMock()
  const hashLocation = window.location.pathname.split('/')[2]
  const { isAuthenticated, loading } = usePrivateRoute()

  if (!mock && hashLocation) {
    window.location.replace(`${tenant}/`)
  }

  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/end', element: <LoggedOut /> },
  ])

  if (mock || tenant) {
    if (mock || isAuthenticated) {
      return <TenantApp />
    } else if (loading) {
      return <Loading />
    } else {
      return <LoginRedirect to={window.location.pathname + window.location.search} tenant={tenant} />
    }
  }

  return routes
})

export default StandaloneApp
