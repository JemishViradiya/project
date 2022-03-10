/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task, TemplatesState } from './types'
import { TaskId, TemplateActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: TemplatesState = {
  tasks: {
    templates: {
      loading: false,
    },
    getAssociatedTemplates: {
      loading: false,
    },
    getTemplate: {
      loading: false,
    },
    createTemplate: {
      loading: false,
    },
    associateTemplates: {
      loading: false,
    },
    disassociateTemplates: {
      loading: false,
    },
    editTemplate: {
      loading: false,
    },
    deleteTemplate: {
      loading: false,
    },
  },
}

//TODO: in TemplatesState there is only "task". Why we return {...state, tasks}?
const updateTask = (state: TemplatesState, taskId: string, data: Task): TemplatesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<TemplatesState, ActionWithPayload<TemplateActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch templates
    case TemplateActionType.FetchTemplatesStart:
      return updateTask(state, TaskId.Templates, { ...state.tasks.templates, loading: true })

    case TemplateActionType.FetchTemplatesError:
      return updateTask(state, TaskId.Templates, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.FetchTemplatesSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.Templates, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedTemplates = [...(state.tasks.templates?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.Templates, {
          loading: false,
          result: { ...action.payload, elements: allFetchedTemplates },
        })
      }
    }

    //fetch associated templates
    case TemplateActionType.FetchAssociatedTemplatesStart:
      return updateTask(state, TaskId.AssociatedTemplates, { ...state.tasks.getAssociatedTemplates, loading: true })

    case TemplateActionType.FetchAssociatedTemplatesError:
      return updateTask(state, TaskId.AssociatedTemplates, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.FetchAssociatedTemplatesSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.AssociatedTemplates, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedAssociatedTemplates = [
          ...(state.tasks.getAssociatedTemplates?.result?.elements ?? []),
          ...action.payload.elements,
        ]
        return updateTask(state, TaskId.AssociatedTemplates, {
          loading: false,
          result: { ...action.payload, elements: allFetchedAssociatedTemplates },
        })
      }
    }

    //get template
    case TemplateActionType.GetTemplateStart:
      return updateTask(state, TaskId.GetTemplate, { loading: true })

    case TemplateActionType.GetTemplateError:
      return updateTask(state, TaskId.GetTemplate, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.GetTemplateSuccess:
      return updateTask(state, TaskId.GetTemplate, {
        loading: false,
        result: action.payload,
      })

    //create template
    case TemplateActionType.CreateTemplateStart:
      return updateTask(state, TaskId.CreateTemplate, { loading: true })

    case TemplateActionType.CreateTemplateError:
      return updateTask(state, TaskId.CreateTemplate, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.CreateTemplateSuccess:
      return updateTask(state, TaskId.CreateTemplate, { loading: false })

    //assotiate templates
    case TemplateActionType.AssociateTemplatesStart:
      return updateTask(state, TaskId.AssociateTemplates, { loading: true })

    case TemplateActionType.AssociateTemplatesError:
      return updateTask(state, TaskId.AssociateTemplates, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.AssociateTemplatesSuccess:
      return updateTask(state, TaskId.AssociateTemplates, {
        loading: false,
      })

    //disassociate templates
    case TemplateActionType.DisassociateTemplatesStart:
      return updateTask(state, TaskId.DisassociateTemplates, { loading: true })

    case TemplateActionType.DisassociateTemplatesError:
      return updateTask(state, TaskId.DisassociateTemplates, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.DisassociateTemplatesSuccess:
      return updateTask(state, TaskId.DisassociateTemplates, {
        loading: false,
      })

    //edit template
    case TemplateActionType.EditTemplateStart:
      return updateTask(state, TaskId.EditTemplate, { loading: true })

    case TemplateActionType.EditTemplateError:
      return updateTask(state, TaskId.EditTemplate, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.EditTemplateSuccess:
      return updateTask(state, TaskId.EditTemplate, {
        loading: false,
      })

    //delete template
    case TemplateActionType.DeleteTemplateStart:
      return updateTask(state, TaskId.DeleteTemplate, { loading: true })

    case TemplateActionType.DeleteTemplateError:
      return updateTask(state, TaskId.DeleteTemplate, {
        loading: false,
        error: action.payload.error,
      })

    case TemplateActionType.DeleteTemplateSuccess:
      return updateTask(state, TaskId.DeleteTemplate, {
        loading: false,
      })

    default:
      return state
  }
}

export default reducer
