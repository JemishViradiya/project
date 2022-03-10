/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { Template, TemplatesApi, TemplatesMockApi } from '../template-service'

export type ApiProvider = typeof TemplatesApi | typeof TemplatesMockApi

export const TemplatesReduxSlice = 'app.dlp.templates'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  Templates = 'templates',
  AssociatedTemplates = 'getAssociatedTemplates',
  GetTemplate = 'getTemplate',
  CreateTemplate = 'createTemplate',
  AssociateTemplates = 'associateTemplates',
  DisassociateTemplates = 'disassociateTemplates',
  EditTemplate = 'editTemplate',
  DeleteTemplate = 'deleteTemplate',
}

export interface TemplatesState {
  tasks?: {
    templates: Task<PagableResponse<Template>>
    getAssociatedTemplates: Task<PagableResponse<Template>>
    getTemplate: Task<Template>
    createTemplate: Task
    associateTemplates: Task
    disassociateTemplates: Task
    editTemplate: Task
    deleteTemplate: Task
  }
}

export const TemplateActionType = {
  FetchTemplatesStart: `${TemplatesReduxSlice}/fetch-templates-start`,
  FetchTemplatesError: `${TemplatesReduxSlice}/fetch-templates-error`,
  FetchTemplatesSuccess: `${TemplatesReduxSlice}/fetch-templates-success`,

  FetchAssociatedTemplatesStart: `${TemplatesReduxSlice}/fetch-associated-templates-start`,
  FetchAssociatedTemplatesError: `${TemplatesReduxSlice}/fetch-associated-templates-error`,
  FetchAssociatedTemplatesSuccess: `${TemplatesReduxSlice}/fetch-associated-templates-success`,

  GetTemplateStart: `${TemplatesReduxSlice}/get-template-start`,
  GetTemplateError: `${TemplatesReduxSlice}/get-template-error`,
  GetTemplateSuccess: `${TemplatesReduxSlice}/get-template-success`,

  CreateTemplateStart: `${TemplatesReduxSlice}/create-template-start`,
  CreateTemplateError: `${TemplatesReduxSlice}/create-template-error`,
  CreateTemplateSuccess: `${TemplatesReduxSlice}/create-template-success`,

  AssociateTemplatesStart: `${TemplatesReduxSlice}/associate-templates-start`,
  AssociateTemplatesError: `${TemplatesReduxSlice}/associate-templates-error`,
  AssociateTemplatesSuccess: `${TemplatesReduxSlice}/associate-templates-success`,

  DisassociateTemplatesStart: `${TemplatesReduxSlice}/disassociate-templates-start`,
  DisassociateTemplatesError: `${TemplatesReduxSlice}/disassociate-templates-error`,
  DisassociateTemplatesSuccess: `${TemplatesReduxSlice}/disassociate-templates-success`,

  EditTemplateStart: `${TemplatesReduxSlice}/edit-template-start`,
  EditTemplateError: `${TemplatesReduxSlice}/edit-template-error`,
  EditTemplateSuccess: `${TemplatesReduxSlice}/edit-template-success`,

  DeleteTemplateStart: `${TemplatesReduxSlice}/delete-template-start`,
  DeleteTemplateError: `${TemplatesReduxSlice}/delete-template-error`,
  DeleteTemplateSuccess: `${TemplatesReduxSlice}/delete-template-success`,
}

// eslint-disable-next-line no-redeclare
export type TemplateActionType = string
