//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { Template } from './templates-types'

export default interface TemplatesInterface {
  /**
   * Creates a new template for this tenant
   * @param template The initial template
   */
  create(template: Template): Response<Partial<Template> | Template>

  /**
   * Associate Templates to the Tenant
   * @param templateIds Template ids
   */
  associateTemplate(templateIds: string[]): Response

  /**
   * Disassociate Templates from the Tenant
   * @param templateIds Template ids
   */
  disassociateTemplate(templateIds: string[]): Response

  /**
   * Get the template data
   * @param templateId The template id
   */
  read(templateId: string): Response<Partial<Template> | Template>

  /**
   * Get all templates
   */
  readAll(params?: PageableSortableQueryParams<Template>): Response<Partial<PagableResponse<Template>> | PagableResponse<Template>>

  /**
   * Get all associated templates
   */
  readAssociated(
    params?: PageableSortableQueryParams<Template>,
  ): Response<Partial<PagableResponse<Template>> | PagableResponse<Template>>

  /**
   * Updates the template data in the Tenant Service
   * @param template The updated template data
   */
  update(template: Partial<Template>): Response<Partial<Template> | Template>

  /**
   * Deletes the template data in the Tenant Service
   * @param templateId The template id
   */
  remove(templateId: string): Response
}
