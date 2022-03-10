import React from 'react'

import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'

const DataTypesSettings = React.lazy(() => import('../data-types/DataTypesSettings'))
const DataTypesCreate = React.lazy(() => import('../data-types/data-type-form/create-data-type'))
const DataTypesUpdate = React.lazy(() => import('../data-types/data-type-form/update-data-type'))
const DataCollectionSettings = React.lazy(() => import('../general/DataCollectionSettings'))
const WhitelistSettings = React.lazy(() => import('../general/WhitelistSettings'))
const TemplateSettings = React.lazy(() => import('../templates/TemplateSettings'))
const TrustedCertificatesSettings = React.lazy(() => import('../trusted-certificates/TrustedCertificatesSettings'))
const NotificationSettings = React.lazy(() => import('../notification/index'))

export const tenantSettingsMap: TabRouteObject[] = [
  {
    path: '/data-collection',
    element: <DataCollectionSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.dataCollection',
    },
    helpId: HelpLinks.AvertDataCollection,
  },
  {
    path: '/whitelisting',
    element: <WhitelistSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.whitelisting',
    },
    helpId: HelpLinks.AvertAllowedDomains,
  },
  {
    path: '/templates',
    element: <TemplateSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.templates',
    },
    helpId: HelpLinks.AvertTemplates,
  },
  {
    path: '/data-types',
    element: <DataTypesSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.dataTypes',
    },
    helpId: HelpLinks.AvertDataTypes,
  },
  {
    path: '/trusted-certificates',
    element: <TrustedCertificatesSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.trustedCertificates',
    },
    helpId: HelpLinks.AvertTrustedCertificates,
  },
  {
    path: '/notifications',
    element: <NotificationSettings />,
    translations: {
      label: 'dlp/common:setting.mainSection.tabTitle.notifications',
    },
    helpId: HelpLinks.AvertNotifications,
  },
]

export const DataType = {
  path: '/data-types',
  children: [
    { path: '/create', element: <DataTypesCreate /> },
    { path: '/update/:guid', element: <DataTypesUpdate /> },
  ],
}
