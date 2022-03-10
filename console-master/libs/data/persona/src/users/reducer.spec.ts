import { PersonaScoreChartInterval, PersonaScoreType } from '../alert-service'
import { getAlertListResponse } from '../alert-service/alerts-mock.data'
import { PersonaModelCommand, PersonaModelType } from '../model-service'
import { GetPersonaModelsResponseMock } from '../model-service/models-mock.data'
import {
  DeviceByUserListResponseMock,
  DeviceContainsDeviceNameResponseMock,
  UserContainsUsernameResponseMock,
  UserDetailsResponseMock,
  UserDevicesResponseMock,
  UsersListResponseMock,
} from '../user-service/users-mock.data'
import { ZonesResponseMock } from '../zone-service'
import {
  deleteUsersError,
  deleteUsersStart,
  deleteUsersSuccess,
  getDeviceByUserListError,
  getDeviceByUserListStart,
  getDeviceByUserListSuccess,
  getScoresForSelectedAlertError,
  getScoresForSelectedAlertStart,
  getScoresForSelectedAlertSuccess,
  getUserActiveAlertsError,
  getUserActiveAlertsStart,
  getUserActiveAlertsSuccess,
  getUserAlertsWithTrustScoreError,
  getUserAlertsWithTrustScoreStart,
  getUserAlertsWithTrustScoreSuccess,
  getUserDetailsError,
  getUserDetailsStart,
  getUserDetailsSuccess,
  getUserDevicePersonaModelsError,
  getUserDevicePersonaModelsStart,
  getUserDevicePersonaModelsSuccess,
  getUserDevicesError,
  getUserDevicesStart,
  getUserDevicesSuccess,
  getUserHistoryAlertsError,
  getUserHistoryAlertsStart,
  getUserHistoryAlertsSuccess,
  getUserListError,
  getUserListStart,
  getUserListSuccess,
  getUserPersonaScoreLogError,
  getUserPersonaScoreLogStart,
  getUserPersonaScoreLogSuccess,
  searchDevicesByDeviceNameError,
  searchDevicesByDeviceNameReset,
  searchDevicesByDeviceNameStart,
  searchDevicesByDeviceNameSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameReset,
  searchUsersByUsernameStart,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameReset,
  searchZonesByNameStart,
  searchZonesByNameSuccess,
  updateUserDevicePersonaModelsError,
  updateUserDevicePersonaModelsStart,
  updateUserDevicePersonaModelsSuccess,
} from './actions'
import reducer, { defaultState } from './reducer'
import { UsersActionType, UsersReduxSlice, UsersTaskId } from './types'

describe(`${UsersReduxSlice} reducer`, () => {
  const mockApiProvider: any = {}

  describe(`${UsersTaskId.Users}`, () => {
    describe(`${UsersActionType.GetUserListStart}`, () => {
      it(`should set ${UsersTaskId.Users} loading state to true`, () => {
        const mockParams: any = {}
        const action = getUserListStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.Users]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserListSuccess}`, () => {
      it(`should set ${UsersTaskId.Users} loading state to false and add data`, () => {
        const action = getUserListSuccess(UsersListResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.Users]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.Users]: {
              loading: false,
              result: UsersListResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserListError}`, () => {
      it(`should set ${UsersTaskId.Users} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserListError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.Users]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.Users]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.DevicesByUser}`, () => {
    describe(`${UsersActionType.GetDeviceByUserListStart}`, () => {
      it(`should set ${UsersTaskId.DevicesByUser} loading state to true`, () => {
        const mockParams: any = {}
        const action = getDeviceByUserListStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DevicesByUser]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetDeviceByUserListSuccess}`, () => {
      it(`should set ${UsersTaskId.DevicesByUser} loading state to false and add data`, () => {
        const action = getDeviceByUserListSuccess(DeviceByUserListResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.DevicesByUser]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DevicesByUser]: {
              loading: false,
              result: DeviceByUserListResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetDeviceByUserListError}`, () => {
      it(`should set ${UsersTaskId.DevicesByUser} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getDeviceByUserListError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.DevicesByUser]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DevicesByUser]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserDetails}`, () => {
    describe(`${UsersActionType.GetUserDetailsStart}`, () => {
      it(`should set ${UsersTaskId.UserDetails} loading state to true`, () => {
        const mockId = 'test-id'
        const action = getUserDetailsStart(mockId, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDetails]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDetailsSuccess}`, () => {
      it(`should set ${UsersTaskId.UserDetails} loading state to false and add data`, () => {
        const action = getUserDetailsSuccess(UserDetailsResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserDetails]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDetails]: {
              loading: false,
              result: UserDetailsResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDetailsError}`, () => {
      it(`should set ${UsersTaskId.UserDetails} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserDetailsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserDetails]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDetails]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.DeleteUsers}`, () => {
    describe(`${UsersActionType.DeleteUsersStart}`, () => {
      it(`should set ${UsersTaskId.DeleteUsers} loading state to true`, () => {
        const mockIds = ['test-id']
        const action = deleteUsersStart(mockIds, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DeleteUsers]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.DeleteUsersSuccess}`, () => {
      it(`should set ${UsersTaskId.DeleteUsers} loading state to false`, () => {
        const action = deleteUsersSuccess()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.DeleteUsers]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DeleteUsers]: {
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.DeleteUsersError}`, () => {
      it(`should set ${UsersTaskId.DeleteUsers} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = deleteUsersError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.DeleteUsers]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.DeleteUsers]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserDevices}`, () => {
    describe(`${UsersActionType.GetUserDevicesStart}`, () => {
      it(`should set ${UsersTaskId.UserDevices} loading state to true`, () => {
        const mockId = 'test-id'
        const action = getUserDevicesStart(mockId, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDevices]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDevicesSuccess}`, () => {
      it(`should set ${UsersTaskId.UserDevices} loading state to false and add data`, () => {
        const action = getUserDevicesSuccess(UserDevicesResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserDevices]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDevices]: {
              loading: false,
              result: UserDevicesResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDevicesError}`, () => {
      it(`should set ${UsersTaskId.UserDevices} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserDevicesError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserDevices]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserDevices]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.PersonaModelsByDeviceId}`, () => {
    describe(`${UsersActionType.GetUserDevicePersonaModelsStart}`, () => {
      it(`should set ${UsersTaskId.PersonaModelsByDeviceId} loading state to true`, () => {
        const mockParams = {
          userId: 'user-id',
          deviceId: 'device-id',
        }
        const action = getUserDevicePersonaModelsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.PersonaModelsByDeviceId]: {
              [mockParams.deviceId]: {
                loading: true,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDevicePersonaModelsSuccess}`, () => {
      it(`should set ${UsersTaskId.PersonaModelsByDeviceId} loading state to false and add data`, () => {
        const mockDeviceId = 'device-id'
        const action = getUserDevicePersonaModelsSuccess(mockDeviceId, GetPersonaModelsResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.PersonaModelsByDeviceId]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.PersonaModelsByDeviceId]: {
              [mockDeviceId]: {
                loading: false,
                result: GetPersonaModelsResponseMock,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserDevicePersonaModelsError}`, () => {
      it(`should set ${UsersTaskId.PersonaModelsByDeviceId} loading state to false and add error`, () => {
        const error = new Error('test error')
        const mockDeviceId = 'device-id'
        const action = getUserDevicePersonaModelsError(mockDeviceId, error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.PersonaModelsByDeviceId]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.PersonaModelsByDeviceId]: {
              [mockDeviceId]: {
                error,
                loading: false,
              },
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UpdateUserDevicePersonaModels}`, () => {
    const mockParams = {
      userId: 'user-id',
      deviceId: 'device-id',
      command: PersonaModelCommand.PAUSE,
      models: [PersonaModelType.META],
    }
    const expectedKey = `${mockParams.deviceId}:${mockParams.models[0]}:${mockParams.command}`

    describe(`${UsersActionType.UpdateUserDevicePersonaModelsStart}`, () => {
      it(`should set ${UsersTaskId.UpdateUserDevicePersonaModels} loading state to true`, () => {
        const action = updateUserDevicePersonaModelsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UpdateUserDevicePersonaModels]: {
              [expectedKey]: {
                loading: true,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.UpdateUserDevicePersonaModelsSuccess}`, () => {
      it(`should set ${UsersTaskId.UpdateUserDevicePersonaModels} loading state to false`, () => {
        const mockDeviceId = 'device-id'
        const action = updateUserDevicePersonaModelsSuccess(mockParams)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UpdateUserDevicePersonaModels]: {
              [expectedKey]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UpdateUserDevicePersonaModels]: {
              [expectedKey]: {
                loading: false,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.UpdateUserDevicePersonaModelsError}`, () => {
      it(`should set ${UsersTaskId.UpdateUserDevicePersonaModels} loading state to false and add error`, () => {
        const error = new Error('test error')
        const mockDeviceId = 'device-id'
        const action = updateUserDevicePersonaModelsError(mockParams, error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UpdateUserDevicePersonaModels]: {
              [expectedKey]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UpdateUserDevicePersonaModels]: {
              [expectedKey]: {
                error,
                loading: false,
              },
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserActiveAlerts}`, () => {
    describe(`${UsersActionType.GetUserActiveAlertsStart}`, () => {
      it(`should set ${UsersTaskId.UserActiveAlerts} loading state to true`, () => {
        const mockParams = {}
        const action = getUserActiveAlertsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserActiveAlerts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserActiveAlertsSuccess}`, () => {
      it(`should set ${UsersTaskId.UserActiveAlerts} loading state to false and add data`, () => {
        const mockResp = getAlertListResponse({ includeMeta: false })
        const action = getUserActiveAlertsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserActiveAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserActiveAlerts]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserActiveAlertsError}`, () => {
      it(`should set ${UsersTaskId.UserActiveAlerts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserActiveAlertsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserActiveAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserActiveAlerts]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserHistoryAlerts}`, () => {
    describe(`${UsersActionType.GetUserHistoryAlertsStart}`, () => {
      it(`should set ${UsersTaskId.UserHistoryAlerts} loading state to true`, () => {
        const mockParams = {}
        const action = getUserHistoryAlertsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserHistoryAlerts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserHistoryAlertsSuccess}`, () => {
      it(`should set ${UsersTaskId.UserHistoryAlerts} loading state to false and add data`, () => {
        const mockResp = getAlertListResponse({ includeMeta: false })
        const action = getUserHistoryAlertsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserHistoryAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserHistoryAlerts]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserHistoryAlertsError}`, () => {
      it(`should set ${UsersTaskId.UserHistoryAlerts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserHistoryAlertsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserHistoryAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserHistoryAlerts]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserPersonaScoreLog}`, () => {
    const mockDeviceId = 'mock_device_id'

    describe(`${UsersActionType.GetUserPersonaScoreLogStart}`, () => {
      it(`should set ${UsersTaskId.UserPersonaScoreLog} loading state to true`, () => {
        const mockParams = [
          {
            interval: PersonaScoreChartInterval.Last24Hours,
            params: {
              deviceId: mockDeviceId,
              userId: 'user_id',
              fromTime: 'from_time',
              toTime: 'to_time',
              scoreType: PersonaScoreType.KEYBOARD,
            },
          },
        ]
        const action = getUserPersonaScoreLogStart(mockDeviceId, mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserPersonaScoreLog]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserPersonaScoreLogSuccess}`, () => {
      it(`should set ${UsersTaskId.UserPersonaScoreLog} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getUserPersonaScoreLogSuccess(mockDeviceId, mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserPersonaScoreLog]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserPersonaScoreLog]: {
              [mockDeviceId]: {
                loading: false,
                result: mockResp,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserPersonaScoreLogError}`, () => {
      it(`should set ${UsersTaskId.UserPersonaScoreLog} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserPersonaScoreLogError(mockDeviceId, error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserPersonaScoreLog]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserPersonaScoreLog]: {
              [mockDeviceId]: {
                error,
                loading: false,
              },
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.UserAlertsWithTrustScore}`, () => {
    const mockDeviceId = 'mock_device_id'

    describe(`${UsersActionType.GetUserAlertsWithTrustScoreStart}`, () => {
      it(`should set ${UsersTaskId.UserAlertsWithTrustScore} loading state to true`, () => {
        const mockParams = {
          params: {
            deviceId: mockDeviceId,
            userId: 'user_id',
            fromTime: 'from_time',
            toTime: 'to_time',
            sort: 'severity',
          },
          interval: PersonaScoreChartInterval.Last30Days,
        }
        const action = getUserAlertsWithTrustScoreStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserAlertsWithTrustScore]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserAlertsWithTrustScoreSuccess}`, () => {
      it(`should set ${UsersTaskId.UserAlertsWithTrustScore} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getUserAlertsWithTrustScoreSuccess(mockDeviceId, mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserAlertsWithTrustScore]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserAlertsWithTrustScore]: {
              [mockDeviceId]: {
                loading: false,
                result: mockResp,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetUserAlertsWithTrustScoreError}`, () => {
      it(`should set ${UsersTaskId.UserAlertsWithTrustScore} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserAlertsWithTrustScoreError(mockDeviceId, error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.UserAlertsWithTrustScore]: {
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.UserAlertsWithTrustScore]: {
              [mockDeviceId]: {
                error,
                loading: false,
              },
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.ScoresForSelectedAlert}`, () => {
    const mockDeviceId = 'mock_device_id'

    describe(`${UsersActionType.GetScoresForSelectedAlertStart}`, () => {
      it(`should set ${UsersTaskId.ScoresForSelectedAlert} loading state to true and clear prev score data`, () => {
        const mockParams = { deviceId: mockDeviceId, alertId: 'alert_id' }
        const action = getScoresForSelectedAlertStart(mockParams, mockApiProvider)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
              [mockDeviceId]: {
                loading: true,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetScoresForSelectedAlertSuccess}`, () => {
      it(`should set ${UsersTaskId.ScoresForSelectedAlert} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getScoresForSelectedAlertSuccess(mockDeviceId, mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
              [mockDeviceId]: {
                loading: false,
                result: mockResp,
              },
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.GetScoresForSelectedAlertError}`, () => {
      it(`should set ${UsersTaskId.ScoresForSelectedAlert} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getScoresForSelectedAlertError(mockDeviceId, error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
              [mockDeviceId]: {
                loading: true,
              },
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.ScoresForSelectedAlert]: {
              other_device: {},
              [mockDeviceId]: {
                loading: false,
                error,
              },
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.SearchUsersByUsernameData}`, () => {
    describe(`${UsersActionType.SearchUsersByUsernameStart}`, () => {
      it(`should set ${UsersTaskId.SearchUsersByUsernameData} loading state to true`, () => {
        const mockParams = { userName: 'mock_username' }
        const action = searchUsersByUsernameStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameSuccess}`, () => {
      it(`should set ${UsersTaskId.SearchUsersByUsernameData} loading state to false and add data`, () => {
        const action = searchUsersByUsernameSuccess(UserContainsUsernameResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: false,
              result: UserContainsUsernameResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameError}`, () => {
      it(`should set ${UsersTaskId.SearchUsersByUsernameData} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = searchUsersByUsernameError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchUsersByUsernameData]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameReset}`, () => {
      it(`should set ${UsersTaskId.SearchUsersByUsernameData} reset state`, () => {
        const action = searchUsersByUsernameReset()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchUsersByUsernameData]: {
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.SearchZonesByNameData}`, () => {
    describe(`${UsersActionType.SearchZonesByNameStart}`, () => {
      it(`should set ${UsersTaskId.SearchZonesByNameData} loading state to true`, () => {
        const zoneName = 'zone_name'
        const action = searchZonesByNameStart(zoneName, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchZonesByNameSuccess}`, () => {
      it(`should set ${UsersTaskId.SearchZonesByNameData} loading state to false and add data`, () => {
        const action = searchZonesByNameSuccess(ZonesResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchZonesByNameData]: {
              loading: false,
              result: ZonesResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchZonesByNameError}`, () => {
      it(`should set ${UsersTaskId.SearchZonesByNameData} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = searchZonesByNameError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchZonesByNameData]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchZonesByNameReset}`, () => {
      it(`should set ${UsersTaskId.SearchZonesByNameData} reset state`, () => {
        const action = searchZonesByNameReset()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchZonesByNameData]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchZonesByNameData]: {
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${UsersTaskId.SearchDevicesByDeviceNameData}`, () => {
    describe(`${UsersActionType.SearchDevicesByDeviceNameStart}`, () => {
      it(`should set ${UsersTaskId.SearchDevicesByDeviceNameData} loading state to true`, () => {
        const mockQuery = 'mock_device_name'
        const action = searchDevicesByDeviceNameStart(mockQuery, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameSuccess}`, () => {
      it(`should set ${UsersTaskId.SearchDevicesByDeviceNameData} loading state to false and add data`, () => {
        const action = searchDevicesByDeviceNameSuccess(DeviceContainsDeviceNameResponseMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: false,
              result: DeviceContainsDeviceNameResponseMock,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameError}`, () => {
      it(`should set ${UsersTaskId.SearchDevicesByDeviceNameData} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = searchDevicesByDeviceNameError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${UsersActionType.SearchUsersByUsernameReset}`, () => {
      it(`should set ${UsersTaskId.SearchDevicesByDeviceNameData} reset state`, () => {
        const action = searchDevicesByDeviceNameReset()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [UsersTaskId.SearchDevicesByDeviceNameData]: {
              loading: false,
            },
          }),
        )
      })
    })
  })
})
