//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { SoftwareTemplate } from './software-template-types'

// ToDo: Actually document interface
export default interface SoftwareTemplateInterface {
  /**
   * Creates a new software template
   * @param template The new software template config
   */
  createSoftwareTemplate(template: SoftwareTemplate): Response<SoftwareTemplate>

  /**
   * Get all static software templates
   */
  getSoftwareTemplates(): Response<Array<SoftwareTemplate>>

  /**
   * Get all static and non-static software templates
   * Query param: list of authorized software ids
   */
  getAllTemplates(softwareIds: string): Response<Array<SoftwareTemplate>>

  getSoftwareTemplateById(id: string): Response<SoftwareTemplate>
  updateSoftwareTemplate(id: string, authenticator: SoftwareTemplate): Response<SoftwareTemplate>
  deleteSoftwareTemplate(id: string): Response<Record<string, unknown>>
}
