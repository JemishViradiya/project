/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { Template } from '../template-service'
import { TemplatesApi, TemplatesMockApi } from '../template-service'
import {
  assotiateTemplatesStart,
  createTemplateStart,
  deleteTemplateStart,
  disassociateTemplatesStart,
  editTemplateStart,
  fetchAssotiatedTemplatesStart,
  fetchTemplatesStart,
  getTemplateStart,
} from './actions'
import {
  getAssociatedTemplatesTask,
  getAssociateTemplatesTask,
  getCreateTemplateTask,
  getDeleteTemplateTask,
  getDisassociateTemplatesTask,
  getEditTemplateTask,
  getTemplatesTask,
  getTemplateTask,
} from './selectors'
import type { TaskId, TemplatesState } from './types'
import { TemplatesReduxSlice } from './types'

const permissions = new Set([Permission.BIP_SETTINGS_READ])

export const queryTemplates: ReduxQuery<
  PagableResponse<Template>,
  Parameters<typeof fetchTemplatesStart>[0],
  TemplatesState['tasks'][TaskId.Templates] //Task<TemplateEntitiesResponse>
> = {
  query: payload => fetchTemplatesStart(payload, TemplatesApi),
  mockQuery: payload => fetchTemplatesStart(payload, TemplatesMockApi),
  selector: () => getTemplatesTask,
  dataProp: 'result', //TODO why "result"? fetchTemplatesSaga? or Task in types?
  slice: TemplatesReduxSlice,
  permissions,
}

export const queryAssociatedTemplates: ReduxQuery<
  PagableResponse<Template>,
  Parameters<typeof fetchAssotiatedTemplatesStart>[0],
  TemplatesState['tasks'][TaskId.AssociatedTemplates] //Task<TemplateEntitiesResponse>
> = {
  query: payload => fetchAssotiatedTemplatesStart(payload, TemplatesApi),
  mockQuery: payload => fetchAssotiatedTemplatesStart(payload, TemplatesMockApi),
  selector: () => getAssociatedTemplatesTask,
  dataProp: 'result',
  slice: TemplatesReduxSlice,
  permissions,
}

export const queryTemplate: ReduxQuery<
  Template,
  Parameters<typeof getTemplateStart>[0],
  TemplatesState['tasks'][TaskId.GetTemplate] //Task
> = {
  query: payload => getTemplateStart(payload, TemplatesApi),
  mockQuery: payload => getTemplateStart(payload, TemplatesMockApi),
  selector: () => getTemplateTask,
  dataProp: 'result',
  slice: TemplatesReduxSlice,
  permissions,
}

export const mutationCreateTemplate: ReduxMutation<
  Template,
  Parameters<typeof createTemplateStart>[0],
  TemplatesState['tasks'][TaskId.CreateTemplate] //Task
> = {
  mutation: payload => createTemplateStart(payload, TemplatesApi),
  mockMutation: payload => createTemplateStart(payload, TemplatesMockApi),
  selector: () => getCreateTemplateTask,
  slice: TemplatesReduxSlice,
}

export const mutationAssotiateTemplates: ReduxMutation<
  void,
  Parameters<typeof assotiateTemplatesStart>[0],
  TemplatesState['tasks'][TaskId.AssociateTemplates] //Task
> = {
  mutation: payload => assotiateTemplatesStart(payload, TemplatesApi),
  mockMutation: payload => assotiateTemplatesStart(payload, TemplatesMockApi),
  selector: () => getAssociateTemplatesTask,
  slice: TemplatesReduxSlice,
}

export const mutationDisassociateTemplates: ReduxMutation<
  void,
  Parameters<typeof disassociateTemplatesStart>[0],
  TemplatesState['tasks'][TaskId.DisassociateTemplates]
> = {
  mutation: payload => disassociateTemplatesStart(payload, TemplatesApi),
  mockMutation: payload => disassociateTemplatesStart(payload, TemplatesMockApi),
  selector: () => getDisassociateTemplatesTask,
  slice: TemplatesReduxSlice,
}

export const mutationEditTemplate: ReduxMutation<
  void, //TODO update return template => change code for editTemplate
  Parameters<typeof editTemplateStart>[0],
  TemplatesState['tasks'][TaskId.EditTemplate] //Task
> = {
  mutation: payload => editTemplateStart(payload, TemplatesApi),
  mockMutation: payload => editTemplateStart(payload, TemplatesMockApi),
  selector: () => getEditTemplateTask,
  slice: TemplatesReduxSlice,
}

export const mutationDeleteTemplate: ReduxMutation<
  void,
  Parameters<typeof deleteTemplateStart>[0],
  TemplatesState['tasks'][TaskId.DeleteTemplate] //Task
> = {
  mutation: payload => deleteTemplateStart(payload, TemplatesApi),
  mockMutation: payload => deleteTemplateStart(payload, TemplatesMockApi),
  selector: () => getDeleteTemplateTask,
  slice: TemplatesReduxSlice,
}
