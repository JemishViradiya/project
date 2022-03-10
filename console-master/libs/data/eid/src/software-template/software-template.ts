//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { baseUrl } from '../config.rest'
import SoftwareTemplateInterface from './software-template-interface'
import { SoftwareTemplate } from './software-template-types'

const pathPrefix = `${baseUrl}/software-templates`

export const SoftwareTemplateProcessor: SoftwareTemplateInterface = {
  createSoftwareTemplate(template: SoftwareTemplate): Response<SoftwareTemplate> {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    throw new Error('Method not implemented.')
  },
  getSoftwareTemplates: async (): Response<SoftwareTemplate[]> => {
    const res = await UesAxiosClient().get(pathPrefix)
    // move 'results' EID return to parent 'data'
    if (res) {
      res.data = res?.data?.results ?? undefined
    }
    return res
  },
  getAllTemplates: async (softwareIds: string): Response<SoftwareTemplate[]> => {
    const res = await UesAxiosClient().get(`${pathPrefix}?softwareIdList=${softwareIds}`)
    // move 'results' EID return to parent 'data'
    if (res) {
      res.data = res?.data?.results ?? undefined
    }
    return res
  },
  getSoftwareTemplateById(id: string): Response<SoftwareTemplate> {
    throw new Error('Method not implemented.')
  },
  updateSoftwareTemplate(id: string, template: SoftwareTemplate): Response<SoftwareTemplate> {
    throw new Error('Method not implemented.')
  },
  deleteSoftwareTemplate(id: string): Response<Record<string, unknown>> {
    throw new Error('Method not implemented.')
  },
}

export { SoftwareTemplate }
export { SoftwareTemplateInterface }
