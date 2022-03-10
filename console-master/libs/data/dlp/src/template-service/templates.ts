//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, tenantBaseUrl } from '../config.rest'
import type { PageableSortableQueryParams } from '../types'
import type TemplatesInterface from './templates-interface'
import type { AssociateTemplates, Template } from './templates-types'

export const makeTemplateEndpoint = (urlPart?: string): string => (urlPart ? `/${urlPart}` : ``)

export const makeTemplateUrl = (urlPart?: string): string => `${tenantBaseUrl}/templates${makeTemplateEndpoint(urlPart)}`

class TemplatesClass implements TemplatesInterface {
  create(template: Template): Response<Partial<Template> | Template> {
    return axiosInstance().post(makeTemplateUrl(), template)
  }
  associateTemplate(templateIds: string[]): Response<unknown> {
    const associateTemplates: AssociateTemplates = {
      add: templateIds,
    }
    return axiosInstance().patch(makeTemplateUrl(), associateTemplates)
  }
  disassociateTemplate(templateIds: string[]): Response<unknown> {
    const disassociateTemplates: AssociateTemplates = {
      remove: templateIds,
    }
    console.log('API, disassociateTemplate = ', disassociateTemplates)
    return axiosInstance().patch(makeTemplateUrl(), disassociateTemplates)
  }
  read(templateId: string): Response<Template | Partial<Template>> {
    return axiosInstance().get(makeTemplateUrl(templateId))
  }
  readAll(
    params?: PageableSortableQueryParams<Template>,
  ): Response<PagableResponse<Template> | Partial<PagableResponse<Template>>> {
    return axiosInstance().get(makeTemplateUrl(), { params: params })
  }
  readAssociated(
    params?: PageableSortableQueryParams<Template>,
  ): Response<PagableResponse<Template> | Partial<PagableResponse<Template>>> {
    return axiosInstance().get(makeTemplateUrl('byTenant'), { params: params })
  }
  update(template: Partial<Template>): Response<Template | Partial<Template>> {
    return axiosInstance().put(makeTemplateUrl(template.guid), template)
  }
  remove(templateId: string): Response<unknown> {
    return axiosInstance().delete(makeTemplateUrl(templateId))
  }
}

const TemplatesApi = new TemplatesClass()

export { TemplatesApi }
