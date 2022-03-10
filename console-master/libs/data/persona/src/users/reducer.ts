import type { Action, Reducer } from 'redux'

import type { PersonaScoreLogItem } from '../alert-service'
import type { PersonaModel, UpdatePersonaModelsParams } from '../model-service'
import type { Task } from '../types'
import type { UserAlertsWithTrustScore, UserPersonaScoreLogData, UsersState } from './types'
import { UsersActionType, UsersTaskId } from './types'
import { getUpdatePersonaModelTaskKey } from './utils'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: UsersState = {
  tasks: {
    users: {
      loading: false,
    },
    devicesGroupedByUsers: {
      loading: false,
    },
    userDetails: {
      loading: false,
    },
    deleteUsers: {
      loading: false,
    },
    userDevices: {
      loading: false,
    },
    personaModelsByDeviceId: {},
    updateUserDevicePersonaModels: {},
    userActiveAlerts: {
      loading: false,
    },
    userHistoryAlerts: {
      loading: false,
    },
    userPersonaScoreLog: {},
    userAlertsWithTrustScore: {},
    scoresForSelectedAlert: {},
    searchUsersByUsernameData: {
      loading: false,
    },
    searchZonesByNameData: {
      loading: false,
    },
    searchDevicesByDeviceNameData: {
      loading: false,
    },
  },
}

const updateTask = (state: UsersState, taskId: string, data: Task): UsersState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const updateUserDevicePersonaModelsTask = (state: UsersState, userDeviceId: string, data: Task<PersonaModel[]>) => ({
  ...updateTask(state, UsersTaskId.PersonaModelsByDeviceId, {
    ...state.tasks[UsersTaskId.PersonaModelsByDeviceId],
    [userDeviceId]: data,
  }),
})

const updateUpdateUserDevicePersonaModelsTask = (
  state: UsersState,
  params: Partial<UpdatePersonaModelsParams>,
  data: Task<PersonaModel[]>,
) => ({
  ...updateTask(state, UsersTaskId.UpdateUserDevicePersonaModels, {
    ...state.tasks[UsersTaskId.UpdateUserDevicePersonaModels],
    [getUpdatePersonaModelTaskKey(params)]: data,
  }),
})

const updateScoresForSelectedAlertTask = (state: UsersState, userDeviceId: string, data: Task<PersonaScoreLogItem[]>) => ({
  ...updateTask(state, UsersTaskId.ScoresForSelectedAlert, {
    ...state.tasks[UsersTaskId.ScoresForSelectedAlert],
    [userDeviceId]: data,
  }),
})

const updateUserDeviceScoreLogTask = (state: UsersState, userDeviceId: string, data: Task<UserPersonaScoreLogData>) => ({
  ...updateTask(state, UsersTaskId.UserPersonaScoreLog, {
    ...state.tasks[UsersTaskId.UserPersonaScoreLog],
    [userDeviceId]: data,
  }),
})

const updateUserDeviceAlertsWithTrustScoreTask = (
  state: UsersState,
  userDeviceId: string,
  data: Task<UserAlertsWithTrustScore>,
) => ({
  ...updateTask(state, UsersTaskId.UserAlertsWithTrustScore, {
    ...state.tasks[UsersTaskId.UserAlertsWithTrustScore],
    [userDeviceId]: data,
  }),
})

const reducer: Reducer<UsersState, ActionWithPayload<string>> = (state = defaultState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    // get user list
    case UsersActionType.GetUserListStart:
      return updateTask(state, UsersTaskId.Users, { ...state.tasks.users, loading: true })
    case UsersActionType.GetUserListError:
      return updateTask(state, UsersTaskId.Users, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserListSuccess:
      return updateTask(state, UsersTaskId.Users, {
        loading: false,
        result: action.payload,
      })

    // get device by user list
    case UsersActionType.GetDeviceByUserListStart:
      return updateTask(state, UsersTaskId.DevicesByUser, { ...state.tasks.devicesGroupedByUsers, loading: true })
    case UsersActionType.GetDeviceByUserListError:
      return updateTask(state, UsersTaskId.DevicesByUser, { loading: false, error: action.payload.error })
    case UsersActionType.GetDeviceByUserListSuccess:
      return updateTask(state, UsersTaskId.DevicesByUser, {
        loading: false,
        result: action.payload,
      })

    // get user details
    case UsersActionType.GetUserDetailsStart:
      return updateTask(state, UsersTaskId.UserDetails, { ...state.tasks.userDetails, loading: true })
    case UsersActionType.GetUserDetailsError:
      return updateTask(state, UsersTaskId.UserDetails, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserDetailsSuccess:
      return updateTask(state, UsersTaskId.UserDetails, {
        loading: false,
        result: action.payload,
      })

    // delete users
    case UsersActionType.DeleteUsersStart:
      return updateTask(state, UsersTaskId.DeleteUsers, { ...state.tasks.deleteUsers, loading: true })
    case UsersActionType.DeleteUsersError:
      return updateTask(state, UsersTaskId.DeleteUsers, { loading: false, error: action.payload.error })
    case UsersActionType.DeleteUsersSuccess:
      return updateTask(state, UsersTaskId.DeleteUsers, {
        loading: false,
      })

    // get user devices
    case UsersActionType.GetUserDevicesStart:
      return updateTask(state, UsersTaskId.UserDevices, { ...state.tasks.userDevices, loading: true })
    case UsersActionType.GetUserDevicesError:
      return updateTask(state, UsersTaskId.UserDevices, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserDevicesSuccess:
      return updateTask(state, UsersTaskId.UserDevices, {
        loading: false,
        result: action.payload,
      })

    // get user device persona models
    case UsersActionType.GetUserDevicePersonaModelsStart:
      return updateUserDevicePersonaModelsTask(state, action.payload.params.deviceId, {
        loading: true,
      })
    case UsersActionType.GetUserDevicePersonaModelsError:
      return updateUserDevicePersonaModelsTask(state, action.payload.id, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserDevicePersonaModelsSuccess:
      return updateUserDevicePersonaModelsTask(state, action.payload.id, {
        loading: false,
        result: action.payload.data,
      })

    // update user device persona models
    case UsersActionType.UpdateUserDevicePersonaModelsStart:
      return updateUpdateUserDevicePersonaModelsTask(state, action.payload.params, {
        loading: true,
      })
    case UsersActionType.UpdateUserDevicePersonaModelsError:
      return updateUpdateUserDevicePersonaModelsTask(state, action.payload.params, { loading: false, error: action.payload.error })
    case UsersActionType.UpdateUserDevicePersonaModelsSuccess:
      return updateUpdateUserDevicePersonaModelsTask(state, action.payload.params, {
        loading: false,
      })

    // get user active alerts
    case UsersActionType.GetUserActiveAlertsStart:
      return updateTask(state, UsersTaskId.UserActiveAlerts, { ...state.tasks.userActiveAlerts, loading: true })
    case UsersActionType.GetUserActiveAlertsError:
      return updateTask(state, UsersTaskId.UserActiveAlerts, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserActiveAlertsSuccess:
      return updateTask(state, UsersTaskId.UserActiveAlerts, {
        loading: false,
        result: action.payload,
      })

    // get user alerts history
    case UsersActionType.GetUserHistoryAlertsStart:
      return updateTask(state, UsersTaskId.UserHistoryAlerts, { ...state.tasks.userHistoryAlerts, loading: true })
    case UsersActionType.GetUserHistoryAlertsError:
      return updateTask(state, UsersTaskId.UserHistoryAlerts, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserHistoryAlertsSuccess:
      return updateTask(state, UsersTaskId.UserHistoryAlerts, {
        loading: false,
        result: action.payload,
      })

    // get user persona score log
    case UsersActionType.GetUserPersonaScoreLogStart:
      return updateUserDeviceScoreLogTask(state, action.payload.deviceId, {
        ...state.tasks[UsersTaskId.UserPersonaScoreLog][action.payload.deviceId],
        loading: true,
      })
    case UsersActionType.GetUserPersonaScoreLogError:
      return updateUserDeviceScoreLogTask(state, action.payload.deviceId, { loading: false, error: action.payload.error })
    case UsersActionType.GetUserPersonaScoreLogSuccess:
      return updateUserDeviceScoreLogTask(state, action.payload.deviceId, {
        loading: false,
        result: action.payload.payload,
      })

    // get user alerts with trust score
    case UsersActionType.GetUserAlertsWithTrustScoreStart:
      return updateUserDeviceAlertsWithTrustScoreTask(state, action.payload.params.params.deviceId, {
        ...state.tasks.userAlertsWithTrustScore[action.payload.params.params.deviceId],
        loading: true,
      })
    case UsersActionType.GetUserAlertsWithTrustScoreError:
      return updateUserDeviceAlertsWithTrustScoreTask(state, action.payload.deviceId, {
        loading: false,
        error: action.payload.error,
      })
    case UsersActionType.GetUserAlertsWithTrustScoreSuccess:
      return updateUserDeviceAlertsWithTrustScoreTask(state, action.payload.deviceId, {
        loading: false,
        result: action.payload.payload,
      })

    // get user alerts with trust score
    case UsersActionType.GetScoresForSelectedAlertStart:
      return updateScoresForSelectedAlertTask(state, action.payload.params.deviceId, {
        loading: true,
        result: undefined,
      })
    case UsersActionType.GetScoresForSelectedAlertError:
      return updateScoresForSelectedAlertTask(state, action.payload.deviceId, { loading: false, error: action.payload.error })
    case UsersActionType.GetScoresForSelectedAlertSuccess:
      return updateScoresForSelectedAlertTask(state, action.payload.deviceId, {
        loading: false,
        result: action.payload.payload,
      })

    // search users by username
    case UsersActionType.SearchUsersByUsernameStart:
      return updateTask(state, UsersTaskId.SearchUsersByUsernameData, { ...state.tasks.searchUsersByUsernameData, loading: true })
    case UsersActionType.SearchUsersByUsernameError:
      return updateTask(state, UsersTaskId.SearchUsersByUsernameData, { loading: false, error: action.payload.error })
    case UsersActionType.SearchUsersByUsernameSuccess:
      return updateTask(state, UsersTaskId.SearchUsersByUsernameData, {
        loading: false,
        result: action.payload,
      })
    case UsersActionType.SearchUsersByUsernameReset:
      return updateTask(state, UsersTaskId.SearchUsersByUsernameData, {
        loading: false,
      })

    // search users by username
    case UsersActionType.SearchZonesByNameStart:
      return updateTask(state, UsersTaskId.SearchZonesByNameData, { ...state.tasks.searchZonesByNameData, loading: true })
    case UsersActionType.SearchZonesByNameError:
      return updateTask(state, UsersTaskId.SearchZonesByNameData, { loading: false, error: action.payload.error })
    case UsersActionType.SearchZonesByNameSuccess:
      return updateTask(state, UsersTaskId.SearchZonesByNameData, {
        loading: false,
        result: action.payload,
      })
    case UsersActionType.SearchZonesByNameReset:
      return updateTask(state, UsersTaskId.SearchZonesByNameData, {
        loading: false,
      })

    // search devices by device name
    case UsersActionType.SearchDevicesByDeviceNameStart:
      return updateTask(state, UsersTaskId.SearchDevicesByDeviceNameData, {
        ...state.tasks.searchDevicesByDeviceNameData,
        loading: true,
      })
    case UsersActionType.SearchDevicesByDeviceNameError:
      return updateTask(state, UsersTaskId.SearchDevicesByDeviceNameData, { loading: false, error: action.payload.error })
    case UsersActionType.SearchDevicesByDeviceNameSuccess:
      return updateTask(state, UsersTaskId.SearchDevicesByDeviceNameData, {
        loading: false,
        result: action.payload,
      })
    case UsersActionType.SearchDevicesByDeviceNameReset:
      return updateTask(state, UsersTaskId.SearchDevicesByDeviceNameData, {
        loading: false,
      })

    default:
      return state
  }
}

export default reducer
