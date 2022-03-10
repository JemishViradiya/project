/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEmpty } from 'lodash-es'
import type { Action, Reducer } from 'redux'

import type { Policy, PolicyValue } from '../policy-service'
import type { PoliciesState, Task } from './types'
import { PolicyActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: PoliciesState = {
  tasks: {
    policies: {
      loading: false,
    },
    policiesByGuids: {
      loading: false,
    },
    getPolicy: {
      loading: false,
    },
    createPolicy: {
      loading: false,
    },
    editPolicy: {
      loading: false,
    },
    deletePolicy: {
      loading: false,
    },
    getDefaultPolicy: {
      loading: false,
    },
    setDefaultPolicy: {
      loading: false,
    },
    getPolicySettingDefinition: {
      loading: false,
    },
  },
  ui: { localPolicyData: {} },
}

const updateTask = (state: PoliciesState, taskId: string, data: Task): PoliciesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const updateTaskWithLocalPolicy = (state: PoliciesState, taskId: string, data: Task): PoliciesState => {
  let localPolicyData: Partial<Policy> = data?.result
  if (localPolicyData) {
    const { value, ...policyGeneralInfo } = localPolicyData
    const policyValues = JSON.parse(value)
    localPolicyData = { ...policyGeneralInfo, ...policyValues }
  }
  return {
    ...updateTask(state, taskId, data),
    ui: { ...state.ui, localPolicyData },
  }
}

const updateTaskWithPolicyDefinition = (state: PoliciesState, taskId: string, data: Task): PoliciesState => {
  const localPolicyData: Partial<PolicyValue> = data?.result
  return {
    ...updateTask(state, taskId, data),
    ui: { ...state.ui, localPolicyData },
  }
}

const reducer: Reducer<PoliciesState, ActionWithPayload<PolicyActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch policies
    case PolicyActionType.FetchPoliciesStart:
      return updateTask(state, TaskId.Policies, { ...state.tasks.policies, loading: true })

    case PolicyActionType.FetchPoliciesError:
      return updateTask(state, TaskId.Policies, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.FetchPoliciesSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.Policies, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedPolicies = [...(state.tasks.policies?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.Policies, {
          loading: false,
          result: { ...action.payload, elements: allFetchedPolicies },
        })
      }
    }

    //fetch policies by guids
    case PolicyActionType.FetchPoliciesByGuidsStart:
      return updateTask(state, TaskId.PoliciesByGuids, { ...state.tasks.policiesByGuids, loading: true })

    case PolicyActionType.FetchPoliciesByGuidsError:
      return updateTask(state, TaskId.PoliciesByGuids, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.FetchPoliciesByGuidsSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.PoliciesByGuids, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedPoliciesByGuids = [...(state.tasks.policiesByGuids?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.PoliciesByGuids, {
          loading: false,
          result: { ...action.payload, elements: allFetchedPoliciesByGuids },
        })
      }
    }

    //get policy
    case PolicyActionType.GetPolicyStart:
      return updateTask(state, TaskId.GetPolicy, { loading: true })

    case PolicyActionType.GetPolicyError:
      return updateTask(state, TaskId.GetPolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.GetPolicySuccess: {
      return updateTaskWithLocalPolicy(state, TaskId.GetPolicy, { loading: false, result: action.payload })
    }

    //create policy
    case PolicyActionType.CreatePolicyStart:
      return updateTask(state, TaskId.CreatePolicy, { loading: true })

    case PolicyActionType.CreatePolicyError:
      return updateTask(state, TaskId.CreatePolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.CreatePolicySuccess:
      return updateTask(state, TaskId.CreatePolicy, { loading: false, result: action.payload })

    //edit policy
    case PolicyActionType.EditPolicyStart:
      return updateTask(state, TaskId.EditPolicy, { loading: true })

    case PolicyActionType.EditPolicyError:
      return updateTask(state, TaskId.EditPolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.EditPolicySuccess:
      return updateTask(state, TaskId.EditPolicy, {
        loading: false,
      })

    //delete policy
    case PolicyActionType.DeletePolicyStart:
      return updateTask(state, TaskId.DeletePolicy, { loading: true })

    case PolicyActionType.DeletePolicyError:
      return updateTask(state, TaskId.DeletePolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.DeletePolicySuccess:
      return updateTask(state, TaskId.DeletePolicy, {
        loading: false,
      })

    //set default policy
    case PolicyActionType.SetDefaultPolicyStart: {
      return updateTask(state, TaskId.SetDefaultPolicy, { loading: true })
    }

    case PolicyActionType.SetDefaultPolicyError:
      return updateTask(state, TaskId.SetDefaultPolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.SetDefaultPolicySuccess:
      return updateTask(state, TaskId.SetDefaultPolicy, { loading: false })

    //get default policy
    case PolicyActionType.GetDefaultPolicyStart:
      return updateTask(state, TaskId.GetDefaultPolicy, { loading: true })

    case PolicyActionType.GetDefaultPolicyError:
      return updateTask(state, TaskId.GetDefaultPolicy, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.GetDefaultPolicySuccess: {
      return updateTask(state, TaskId.GetDefaultPolicy, { loading: false, result: action.payload })
    }

    //get policy setting definition
    case PolicyActionType.GetPolicySettingDefinitionStart:
      return updateTask(state, TaskId.GetPolicySettingDefinition, { loading: true })

    case PolicyActionType.GetPolicySettingDefinitionError:
      return updateTask(state, TaskId.GetPolicySettingDefinition, {
        loading: false,
        error: action.payload.error,
      })

    case PolicyActionType.GetPolicySettingDefinitionSuccess: {
      return updateTaskWithPolicyDefinition(state, TaskId.GetPolicySettingDefinition, { loading: false, result: action.payload })
    }

    case PolicyActionType.UpdateLocalPolicyData: {
      return {
        ...state,
        ui: {
          ...state.ui,
          localPolicyData: isEmpty(action.payload) ? {} : { ...state.ui.localPolicyData, ...action.payload },
        },
      }
    }

    case PolicyActionType.ClearPolicy: {
      return {
        ...state,
        ui: { ...state.ui, localPolicyData: {} },
      }
    }

    default:
      return state
  }
}

export default reducer
