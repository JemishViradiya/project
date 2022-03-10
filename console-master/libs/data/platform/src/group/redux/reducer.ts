/* eslint-disable sonarjs/max-switch-cases */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { GroupsState, Task } from './types'
import { ActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: GroupsState = {
  tasks: {
    // Group
    deleteGroups: {
      loading: false,
    },
    createGroup: {
      loading: false,
    },
    updateGroup: {
      loading: false,
    },
    currentGroup: {
      loading: false,
    },
    searchDirectoryGroups: {
      loading: false,
    },
    // Profile
    assignableProfiles: {
      loading: false,
      result: [],
    },
    assignedProfiles: {
      loading: false,
      result: [],
    },
    assignProfiles: {
      loading: false,
    },
    unassignProfile: {
      loading: false,
    },
    // User
    addUsers: {
      loading: false,
    },
    removeUsers: {
      loading: false,
    },
  },
}

const updateTask = (state: GroupsState, taskId: string, data: Task): GroupsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const handleError = (state: GroupsState, task: string, action: ActionWithPayload<string>) => {
  return updateTask(state, task, {
    loading: false,
    error: action.payload.error,
  })
}

const reducer: Reducer<GroupsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // Delete group
    case ActionType.DeleteGroupsStart:
      return updateTask(state, 'deleteGroups', { loading: true })
    case ActionType.DeleteGroupsError:
      return handleError(state, 'deleteGroups', action)
    case ActionType.DeleteGroupsSuccess:
      return updateTask(state, 'deleteGroups', { loading: false })

    // Create group
    case ActionType.CreateGroupStart:
      return updateTask(state, 'createGroup', { loading: true })
    case ActionType.CreateGroupError:
      return handleError(state, 'createGroup', action)
    case ActionType.CreateGroupSuccess:
      return updateTask(state, 'createGroup', { loading: false, result: action.payload.group })

    // Update group
    case ActionType.UpdateGroupStart:
      return updateTask(state, 'updateGroup', { loading: true })
    case ActionType.UpdateGroupError:
      return handleError(state, 'updateGroup', action)
    case ActionType.UpdateGroupSuccess:
      return updateTask(state, 'updateGroup', { loading: false, result: action.payload.group })

    // Get current group
    case ActionType.GetCurrentGroupStart:
      return updateTask(state, 'currentGroup', { loading: true })
    case ActionType.GetCurrentGroupError:
      return handleError(state, 'currentGroup', action)
    case ActionType.GetCurrentGroupSuccess:
      return updateTask(state, 'currentGroup', { loading: false, result: action.payload.group })

    // Search for directory groups
    case ActionType.SearchDirectoryGroupsStart:
      return updateTask(state, 'searchDirectoryGroups', { loading: true })
    case ActionType.SearchDirectoryGroupsError:
      return handleError(state, 'searchDirectoryGroups', action)
    case ActionType.SearchDirectoryGroupsSuccess:
      return updateTask(state, 'searchDirectoryGroups', { loading: false, result: action.payload.directoryGroups })

    // Get assignable profiles
    case ActionType.GetAssignableProfilesStart:
      return updateTask(state, 'assignableProfiles', { loading: true })
    case ActionType.GetAssignableProfilesError:
      return handleError(state, 'assignableProfiles', action)
    case ActionType.GetAssignableProfilesSuccess:
      return updateTask(state, 'assignableProfiles', { loading: false, result: action.payload.profiles })

    // Get assigned profiles
    case ActionType.GetAssignedProfilesStart:
      return updateTask(state, 'assignedProfiles', { loading: true })
    case ActionType.GetAssignedProfilesError:
      return handleError(state, 'assignedProfiles', action)
    case ActionType.GetAssignedProfilesSuccess:
      return updateTask(state, 'assignedProfiles', { loading: false, result: action.payload.profiles })

    // Assign profiles
    case ActionType.AssignProfilesStart:
      return updateTask(state, 'assignProfiles', { loading: true })
    case ActionType.AssignProfilesError:
      return handleError(state, 'assignProfiles', action)
    case ActionType.AssignProfilesSuccess: {
      let newAssigned = []
      if (action.payload.profiles.length === 1 && action.payload.reconciliationType === 'RANKING') {
        // Replace existing ranking policy
        const filteredAssignable = state.tasks.assignedProfiles.result.filter(
          p => p.entityType !== action.payload.profiles[0].entityType,
        )
        filteredAssignable.push(action.payload.profiles[0])
        newAssigned = filteredAssignable
      } else {
        newAssigned = state.tasks.assignedProfiles.result.concat(action.payload.profiles)
      }
      return {
        ...state,
        tasks: { ...state.tasks, assignProfiles: { loading: false }, assignedProfiles: { loading: false, result: newAssigned } },
      }
    }

    // Unassign profiles
    case ActionType.UnassignProfilesStart:
      return updateTask(state, 'unassignProfile', { loading: true })
    case ActionType.UnassignProfilesError:
      return handleError(state, 'unassignProfile', action)
    case ActionType.UnassignProfilesSuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          unassignProfile: { loading: false },
          assignedProfiles: {
            loading: false,
            result: state.tasks.assignedProfiles.result.filter(p => p.entityId !== action.payload.profile.entityId),
          },
        },
      }

    // Add users
    case ActionType.AddUsersStart:
      return updateTask(state, 'addUsers', { loading: true })
    case ActionType.AddUsersError:
      return handleError(state, 'addUsers', action)
    case ActionType.AddUsersSuccess:
      return updateTask(state, 'addUsers', { loading: false })

    // Remove users
    case ActionType.RemoveUsersStart:
      return updateTask(state, 'removeUsers', { loading: true })
    case ActionType.RemoveUsersError:
      return handleError(state, 'removeUsers', action)
    case ActionType.RemoveUsersSuccess:
      return updateTask(state, 'removeUsers', { loading: false })

    default:
      return state
  }
}

export default reducer
