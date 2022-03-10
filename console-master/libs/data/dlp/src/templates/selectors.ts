/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { TemplatesState } from './types'
import { TemplatesReduxSlice } from './types'

const getState = (state: { [k in typeof TemplatesReduxSlice]: TemplatesState }) => state[TemplatesReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getTemplates = createSelector(getTasks, tasks => tasks?.templates?.result?.elements ?? [])

export const getTemplatesTask = createSelector(getTasks, tasks => tasks?.templates)

export const getAssociatedTemplatesTask = createSelector(getTasks, tasks => tasks?.getAssociatedTemplates)

export const getTemplateTask = createSelector(getTasks, tasks => tasks?.getTemplate)

export const getCreateTemplateTask = createSelector(getTasks, tasks => tasks?.createTemplate)

export const getAssociateTemplatesTask = createSelector(getTasks, tasks => tasks?.associateTemplates)

export const getDisassociateTemplatesTask = createSelector(getTasks, tasks => tasks?.disassociateTemplates)

export const getEditTemplateTask = createSelector(getTasks, tasks => tasks?.editTemplate)

export const getDeleteTemplateTask = createSelector(getTasks, tasks => tasks?.deleteTemplate)
