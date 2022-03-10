import type { Action, Reducer } from 'redux'

import { DevicePoliciesActions, DevicePoliciesTaskId } from './constants'
import type { DevicePoliciesApiProvider, DevicePoliciesState, DevicePoliciesTask, DevicePolicyListItem } from './types'

interface ActionWithPayload<TActionType extends string, TPayload> extends Action<TActionType> {
  payload: TPayload
}

const defaultState: DevicePoliciesState = {
  tasks: {
    [DevicePoliciesTaskId.FetchDevicePolicyList]: { loading: false, result: [] },
  },
}

const updateTask = (state: DevicePoliciesState, taskId: DevicePoliciesTaskId, data: DevicePoliciesTask): DevicePoliciesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [`${taskId}`]: data,
  },
})

const reducer: Reducer<
  DevicePoliciesState,
  ActionWithPayload<string, DevicePolicyListItem[] | DevicePoliciesApiProvider | Error>
> = (state = defaultState, action): DevicePoliciesState => {
  switch (action.type) {
    case DevicePoliciesActions.FetchDevicePolicyListStart:
      return updateTask(state, DevicePoliciesTaskId.FetchDevicePolicyList, {
        ...state.tasks.fetchDevicePolicyList,
        loading: true,
      })
    case DevicePoliciesActions.FetchDevicePolicyListSuccess:
      return updateTask(state, DevicePoliciesTaskId.FetchDevicePolicyList, { loading: false, result: action.payload })
    case DevicePoliciesActions.FetchDevicePolicyListError:
      return updateTask(state, DevicePoliciesTaskId.FetchDevicePolicyList, {
        ...state.tasks.fetchDevicePolicyList,
        loading: false,
        error: action.payload as Error,
      })
    default:
      return state
  }
}

export { reducer as default, defaultState }
