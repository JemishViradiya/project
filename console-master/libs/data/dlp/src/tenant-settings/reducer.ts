/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Reducer } from 'redux'

import type { ActionWithPayload, Task } from '../types'
import type { TenantConfigsState } from './configs-types'
import { ConfigsActionType, TaskId } from './configs-types'

export const defaultState: TenantConfigsState = {
  tasks: {
    fetchConfigs: {
      loading: false,
    },
    updateConfigs: {
      loading: false,
    },
    fetchFileSettings: {
      loading: false,
    },
    updateFileSettings: {
      loading: false,
    },
    fetchRemediationSettings: {
      loading: false,
    },
    updateRemediationSettings: {
      loading: false,
    },
  },
}

const updateTask = (state: TenantConfigsState, taskId: string, data: Task): TenantConfigsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<TenantConfigsState, ActionWithPayload<ConfigsActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch tenant configs
    case ConfigsActionType.FetchConfigsStart:
      return updateTask(state, TaskId.FetchConfigs, {
        ...state.tasks.fetchConfigs,
        loading: true,
      })

    case ConfigsActionType.FetchConfigsError:
      return updateTask(state, TaskId.FetchConfigs, {
        loading: false,
        error: action.payload.error,
      })

    case ConfigsActionType.FetchConfigsSuccess: {
      return updateTask(state, TaskId.FetchConfigs, {
        loading: false,
        result: action.payload,
      })
    }

    // update tenant configs
    case ConfigsActionType.UpdateConfigsStart:
      return updateTask(state, TaskId.UpdateConfigs, { loading: true })

    case ConfigsActionType.UpdateConfigsError:
      return updateTask(state, TaskId.UpdateConfigs, {
        loading: false,
        error: action.payload.error,
      })

    case ConfigsActionType.UpdateConfigsSuccess:
      return updateTask(state, TaskId.UpdateConfigs, { loading: false, result: action.payload })

    // fetch file settings
    case ConfigsActionType.FetchFileSettingsStart:
      return updateTask(state, TaskId.FetchFileSettings, {
        ...state.tasks.fetchFileSettings,
        loading: true,
      })

    case ConfigsActionType.FetchFileSettingsError:
      return updateTask(state, TaskId.FetchFileSettings, {
        loading: false,
        error: action.payload.error,
      })

    case ConfigsActionType.FetchFileSettingsSuccess: {
      console.log('REDUCER, FetchFileSettingsSuccess, action = ', action)
      console.log('REDUCER, FetchFileSettingsSuccess, state = ', state)
      return updateTask(state, TaskId.FetchFileSettings, {
        loading: false,
        result: action.payload,
      })
    }
    // update tenant configs
    case ConfigsActionType.UpdateFileSettingsStart:
      return updateTask(state, TaskId.UpdateFileSettings, { loading: true })

    case ConfigsActionType.UpdateFileSettingsError:
      return updateTask(state, TaskId.UpdateFileSettings, {
        loading: false,
        error: action.payload.error,
      })

    case ConfigsActionType.UpdateFileSettingsSuccess:
      return updateTask(state, TaskId.UpdateFileSettings, { loading: false, result: action.payload })

    //fetch tenant configs
    case ConfigsActionType.FetchRemediationSettingsStart:
      return updateTask(state, TaskId.FetchRemediationSettings, {
        ...state.tasks.fetchRemediationSettings,
        loading: true,
      })

    case ConfigsActionType.FetchRemediationSettingsError:
      return updateTask(state, TaskId.FetchRemediationSettings, {
        loading: false,
        error: action.payload.error,
      })

    case ConfigsActionType.FetchRemediationSettingsSuccess: {
      return updateTask(state, TaskId.FetchRemediationSettings, {
        loading: false,
        result: action.payload,
      })
    }

    case ConfigsActionType.UpdateRemediationSettingsStart:
      return updateTask(state, TaskId.UpdateRemediationSettings, { loading: true })

    case ConfigsActionType.UpdateRemediationSettingsError:
      return updateTask(state, TaskId.UpdateRemediationSettings, {
        loading: false,
        error: action.payload.error.response.status,
      })

    case ConfigsActionType.UpdateRemediationSettingsSuccess:
      return updateTask(state, TaskId.UpdateRemediationSettings, { loading: false, result: action.payload })

    default:
      return state
  }
}

export default reducer
