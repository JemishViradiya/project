import React, { lazy } from 'react'

const Intune = lazy(() => import('./EmmConnections'))
const AddIntune = lazy(() => import('./add/AddIntuneConnection'))
const AppConfig = lazy(() => import('./appConfig/AddConnectionAppConfig'))

const AddUEM = lazy(() => import('./uem/add/AddUemConnection'))
const IpAddresConfig = lazy(() => import('./policyandipaddress/PolicyAndIpAddress'))

export const EmmConnections = {
  path: '/EmmConnections',
  children: [{ path: '/', element: <Intune /> }],
}

export const AddIntuneConnection = {
  path: '/add/AddIntuneConnection',
  children: [{ path: '/', element: <AddIntune /> }],
}

export const AddUEMConnection = {
  path: '/add/AddUEMConnection',
  children: [{ path: '/', element: <AddUEM /> }],
}

export const AppConfiguration = {
  path: '/intune/appconfig',
  children: [{ path: '/', element: <AppConfig /> }],
}

export const PolicyAndIpAddress = {
  path: '/PolicyAndIpAddress',
  children: [{ path: '/', element: <IpAddresConfig /> }],
}

export const Emm = {
  path: '/emm',
  children: [
    { path: '/', element: <Intune /> },
    EmmConnections,
    AddIntuneConnection,
    AppConfiguration,
    AddUEMConnection,
    PolicyAndIpAddress,
  ],
}

export const EmmRoutes = {
  path: '/settings/emm',
  children: [
    { path: '/', element: <Intune /> },
    EmmConnections,
    AddIntuneConnection,
    AppConfiguration,
    AddUEMConnection,
    PolicyAndIpAddress,
  ],
}
