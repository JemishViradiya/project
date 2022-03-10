/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { PagableResponse } from '@ues-data/shared-types'

import type { Template } from '../template-service/templates-types'
import type { PageableSortableQueryParams } from '../types'
import type { ApiProvider, Task } from './types'
import { TemplateActionType } from './types'

//fetch templates
export const fetchTemplatesStart = (payload: PageableSortableQueryParams<Template>, apiProvider: ApiProvider) => ({
  type: TemplateActionType.FetchTemplatesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchTemplatesSuccess = (payload: PagableResponse<Template>) => ({
  type: TemplateActionType.FetchTemplatesSuccess,
  payload,
})

export const fetchTemplatesError = (error: Error) => ({
  type: TemplateActionType.FetchTemplatesError,
  payload: { error },
})

//fetch assotiated templates
export const fetchAssotiatedTemplatesStart = (payload: PageableSortableQueryParams<Template>, apiProvider: ApiProvider) => ({
  type: TemplateActionType.FetchAssociatedTemplatesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchAssotiatedTemplatesSuccess = (payload: PagableResponse<Template>) => ({
  type: TemplateActionType.FetchAssociatedTemplatesSuccess,
  payload,
})

export const fetchAssotiatedTemplatesError = (error: Error) => ({
  type: TemplateActionType.FetchAssociatedTemplatesError,
  payload: { error },
})

//get template
export const getTemplateStart = (payload: { templateId: string }, apiProvider: ApiProvider) => ({
  type: TemplateActionType.GetTemplateStart,
  payload: { ...payload, apiProvider },
})

export const getTemplateSuccess = (payload: Template) => ({
  type: TemplateActionType.GetTemplateSuccess,
  payload,
})

export const getTemplateError = (error: Error) => ({
  type: TemplateActionType.GetTemplateError,
  payload: { error },
})

//create template
export const createTemplateStart = (payload: Template, apiProvider: ApiProvider) => ({
  type: TemplateActionType.CreateTemplateStart,
  payload: { apiProvider, template: payload },
})

export const createTemplateSuccess = () => ({
  type: TemplateActionType.CreateTemplateSuccess,
})

export const createTemplateError = (error: Error) => ({
  type: TemplateActionType.CreateTemplateError,
  payload: { error },
})

//assotiate templates
export const assotiateTemplatesStart = (payload: { templateIds: string[] }, apiProvider: ApiProvider) => ({
  type: TemplateActionType.AssociateTemplatesStart,
  payload: { ...payload, apiProvider },
})

export const assotiateTemplatesSuccess = () => ({
  type: TemplateActionType.AssociateTemplatesSuccess,
})

export const assotiateTemplatesError = (error: Error) => ({
  type: TemplateActionType.AssociateTemplatesError,
  payload: { error },
})

//disassociate templates
export const disassociateTemplatesStart = (payload: { templateIds: string[] }, apiProvider: ApiProvider) => ({
  type: TemplateActionType.DisassociateTemplatesStart,
  payload: { ...payload, apiProvider },
})

export const disassociateTemplatesSuccess = () => ({
  type: TemplateActionType.DisassociateTemplatesSuccess,
})

export const disassociateTemplatesError = (error: Error) => ({
  type: TemplateActionType.DisassociateTemplatesError,
  payload: { error },
})

//edit template
export const editTemplateStart = (payload: Template, apiProvider: ApiProvider) => ({
  type: TemplateActionType.EditTemplateStart,
  payload: { apiProvider, template: payload },
})

export const editTemplateSuccess = () => ({
  type: TemplateActionType.EditTemplateSuccess,
})

export const editTemplateError = (error: Error) => ({
  type: TemplateActionType.EditTemplateError,
  payload: { error },
})

//delete template
export const deleteTemplateStart = (payload: { templateId: string }, apiProvider: ApiProvider) => ({
  type: TemplateActionType.DeleteTemplateStart,
  payload: { ...payload, apiProvider },
})

export const deleteTemplateSuccess = () => ({
  type: TemplateActionType.DeleteTemplateSuccess,
})

export const deleteTemplateError = (error: Error) => ({
  type: TemplateActionType.DeleteTemplateError,
  payload: { error },
})
