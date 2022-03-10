//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncMutation } from '@ues-data/shared'

import { SoftwareTemplateProcessor } from './software-template'
import { SoftwareTemplateMock } from './software-template-mock'
import type { SoftwareTemplate } from './software-template-types'

export const mutateCreateSoftwareTemplate: AsyncMutation<typeof SoftwareTemplate, { template: SoftwareTemplate }> = {
  mutation: async ({ template }) => {
    const data = await SoftwareTemplateProcessor.createSoftwareTemplate(template)

    return data.data
  },
  mockMutationFn: async ({ template }): Promise<SoftwareTemplate> => {
    const data = await SoftwareTemplateMock.createSoftwareTemplate(template)
    return data.data
  },
}

export const mutateUpdateSoftwareTemplate: AsyncMutation<typeof SoftwareTemplate, { id: string; template: SoftwareTemplate }> = {
  mutation: async ({ id, template }) => {
    const data = await SoftwareTemplateProcessor.updateSoftwareTemplate(id, template)

    return data.data
  },
  mockMutationFn: async ({ id, template }): Promise<SoftwareTemplate> => {
    const data = await SoftwareTemplateMock.updateSoftwareTemplate(id, template)
    return data.data
  },
}

export const mutateDeleteSoftwareTemplate: AsyncMutation<unknown, { id: string }> = {
  mutation: async ({ id }) => {
    const data = await SoftwareTemplateProcessor.deleteSoftwareTemplate(id)

    return data.data
  },
  mockMutationFn: async ({ id }) => {
    const data = await SoftwareTemplateMock.deleteSoftwareTemplate(id)
    return data.data
  },
}
