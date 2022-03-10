/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { lazy } from 'react'
import { Navigate } from 'react-router'

import { FeatureName, Permission } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'
import { SecuredContent } from '@ues/behaviours'

import { customBcnRoute } from './BCNConnectivity'

const Settings = lazy(() => import('./Settings'))

export const CompanyDirectory = lazy(() => import('./companydirectory/CompanyDirectory'))
const AddAzureConnection = lazy(() => import('./companydirectory/azure/AddAzureConnection'))
const EditAzureConnection = lazy(() => import('./companydirectory/azure/EditAzureConnection'))

export const BCNConnectivity = lazy(() => import('./BCNConnectivity/BCNConnectivity'))
const GenerateBCN = lazy(() => import('./BCNConnectivity/GenerateBCN/GenerateBCN'))
const BCNSettings = lazy(() => import('./BCNConnectivity/Settings/BCNSettings'))

const ActivationSettings = lazy(() => import('./activation/ActivationSettings'))

export const PlatformCompanyDirectoryRoute = {
  path: '/companydirectory',
  element: (
    <SecuredContent requiredPermissions={Permission.ECS_DIRECTORY_READ}>
      <CompanyDirectory />
    </SecuredContent>
  ),
}

export const PlatformCompanyDirectoryDetailsRoutes = {
  path: '/companydirectory/azure',
  children: [
    { path: '/', element: <AddAzureConnection /> },
    { path: '/:id', element: <EditAzureConnection /> },
    { path: '/addSchedule/:id', element: <EditAzureConnection /> },
  ],
}

export const PlatformCompanyDirectory = {
  path: '/companydirectory',
  children: [
    { path: '/', element: <CompanyDirectory /> },
    { path: '/azure', element: <AddAzureConnection /> },
    { path: '/azure/:id', element: <EditAzureConnection /> },
    { path: '/azure/addSchedule/:id', element: <EditAzureConnection /> },
  ],
}

export const PlatformBCN = {
  path: '/bcnconnectivity',
  element: (
    <SecuredContent requiredPermissions={Permission.ECS_BCN_READ}>
      <BCNConnectivity />
    </SecuredContent>
  ),
}

export const PlatformBCNAdditional = {
  path: '/bcnconnectivity',
  children: [
    { path: '/generatebcn', element: <GenerateBCN /> },
    { path: '/settings', element: <BCNSettings /> },
  ],
}

export const PlatformActivationSettings = {
  path: '/activation',
  features: [FeatureName.MobileThreatDetection],
  element: <ActivationSettings />,
}

export const PlatformSettings = {
  path: '/settings',
  children: [{ path: '/', element: <Settings /> }, PlatformCompanyDirectory, PlatformActivationSettings],
}

export const DirectoryConnectionsTabs: TabRouteObject[] = [
  {
    path: '/company-directory',
    element: (
      <SecuredContent requiredPermissions={Permission.ECS_DIRECTORY_READ}>
        <CompanyDirectory />
      </SecuredContent>
    ),
    translations: {
      label: 'console:directoryConnections.connections.title',
    },
    helpId: HelpLinks.DirectoryConnections,
  },
  {
    path: '/bcn-connectivity',
    element: (
      <SecuredContent requiredPermissions={Permission.ECS_BCN_READ}>
        <BCNConnectivity />
      </SecuredContent>
    ),
    translations: {
      label: 'console:directoryConnections.connectivityNode.title',
    },
    helpId: HelpLinks.ConnectivityNode,
  },
]

export const DirectoryConnectionsRoutes = {
  path: '/settings/directory-connections',
  element: <Settings />,
  children: [{ path: '/', element: <Navigate to="./company-directory" /> }, ...DirectoryConnectionsTabs],
}

export { customBcnRoute, Settings as ConnectionSettings }

export * from './activation'
export * from './BCNConnectivity'
export * from './companydirectory'
