//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import { AuthorizedSoftwareProcessor } from '../authorized-software/authorized-software'
import { AuthorizedSoftwareMock } from '../authorized-software/authorized-software-mock'
import { SoftwareTemplateProcessor } from './software-template'
import { SoftwareTemplateMock } from './software-template-mock'
import type { SoftwareTemplate } from './software-template-types'

export const querySoftwareTemplates: AsyncQuery<SoftwareTemplate[], void> = {
  query: async () => {
    const data = await SoftwareTemplateProcessor.getSoftwareTemplates()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await SoftwareTemplateMock.getSoftwareTemplates()
    return data.data
  },
  permissions: NoPermissions,
}
export const queryAllTemplates: AsyncQuery<SoftwareTemplate[], void> = {
  query: async () => {
    const dataApps = await AuthorizedSoftwareProcessor.getAuthorizedSoftwares()
    const softwareIds =
      dataApps && dataApps.data && dataApps.data.length > 0 ? dataApps.data.map(data_app => data_app.software_id).toString() : ''
    const data = await SoftwareTemplateProcessor.getAllTemplates(softwareIds)
    return data.data
  },
  mockQueryFn: async () => {
    const dataApps = await AuthorizedSoftwareMock.getAuthorizedSoftwares()
    const softwareIds =
      dataApps && dataApps.data && dataApps.data.length > 0 ? dataApps.data.map(data_app => data_app.software_id).toString() : ''
    const data = await SoftwareTemplateMock.getAllTemplates(softwareIds)
    return data.data
  },
  permissions: NoPermissions,
}
export const querySoftwareTemplate: AsyncQuery<SoftwareTemplate, { id: string }> = {
  query: async ({ id }) => {
    const data = await SoftwareTemplateProcessor.getSoftwareTemplateById(id)
    return data.data
  },
  mockQueryFn: async ({ id }) => {
    const data = await SoftwareTemplateMock.getSoftwareTemplateById(id)
    return data.data
  },
  permissions: NoPermissions,
}
