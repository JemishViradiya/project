import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { AlertsMockApi, PersonaAlertStatus, PersonaScoreChartInterval, PersonaScoreType } from '../alert-service'
import { getAlertListResponse } from '../alert-service/alerts-mock.data'
import { ModelsMockApi, PersonaModelCommand, PersonaModelType } from '../model-service'
import { GetPersonaModelsResponseMock } from '../model-service/models-mock.data'
import { UsersMockApi } from '../user-service'
import {
  DeviceByUserListResponseMock,
  DeviceContainsDeviceNameResponseMock,
  UserContainsUsernameResponseMock,
  UserDetailsResponseMock,
  UserDevicesResponseMock,
  UsersListResponseMock,
} from '../user-service/users-mock.data'
import { ZonesMockApi, ZonesResponseMock } from '../zone-service'
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
  searchDevicesByDeviceNameStart,
  searchDevicesByDeviceNameSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameStart,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameStart,
  searchZonesByNameSuccess,
  updateUserDevicePersonaModelsError,
  updateUserDevicePersonaModelsStart,
  updateUserDevicePersonaModelsSuccess,
} from './actions'
import { DEFAULT_PERSONA_SCORE_DATA, DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA } from './constants'
import { defaultState } from './reducer'
import {
  deleteUsersSaga,
  getDeviceByUserListSaga,
  getScoreForSelectedAlertsSaga,
  getUserActiveAlertsSaga,
  getUserAlertsWithTrustScoreSaga,
  getUserDetailsSaga,
  getUserDevicePersonaModelsSaga,
  getUserDevicesSaga,
  getUserHistoryAlertsSaga,
  getUserListSaga,
  getUserPersonaScoreLogSaga,
  searchDevicesByDeviceNameSaga,
  searchUsersByUsernameSaga,
  searchZonesByNameSaga,
  updateUserDevicePersonaModelsSaga,
} from './sagas'
import { UsersReduxSlice } from './types'

describe(`${UsersReduxSlice} sagas`, () => {
  const mockStateObj = { [UsersReduxSlice]: defaultState }

  describe('getUserListSaga', () => {
    const params = { page: 1 }
    const action = getUserListStart(params, UsersMockApi)

    it('should fetch users list', () => {
      const expectedParams = { ...params, includeMeta: true }
      return expectSaga(getUserListSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserList), { data: UsersListResponseMock }]])
        .call(UsersMockApi.getUserList, expectedParams)
        .put(getUserListSuccess(UsersListResponseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserListSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserList), throwError(error)]])
        .put(getUserListError(error))
        .run()
    })
  })

  describe('getDeviceByUserListSaga', () => {
    const params = { page: 1 }
    const action = getDeviceByUserListStart(params, UsersMockApi)

    it('should fetch device by user list', () => {
      const expectedParams = { ...params, includeMeta: true }
      return expectSaga(getDeviceByUserListSaga, action)
        .provide([
          [matchers.call.fn(action.payload.apiProvider.getDevicesGroupedByUserList), { data: DeviceByUserListResponseMock }],
        ])
        .call(UsersMockApi.getDevicesGroupedByUserList, expectedParams)
        .put(getDeviceByUserListSuccess(DeviceByUserListResponseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getDeviceByUserListSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getDevicesGroupedByUserList), throwError(error)]])
        .put(getDeviceByUserListError(error))
        .run()
    })
  })

  describe('getUserDetailsSaga', () => {
    const userId = 'test_id'
    const action = getUserDetailsStart(userId, UsersMockApi)
    it('should fetch user details', () => {
      return expectSaga(getUserDetailsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserDetails), { data: UserDetailsResponseMock }]])
        .call(UsersMockApi.getUserDetails, userId)
        .put(getUserDetailsSuccess(UserDetailsResponseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserDetailsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserDetails), throwError(error)]])
        .put(getUserDetailsError(error))
        .run()
    })
  })

  describe('deleteUsersSaga', () => {
    const userIds = ['test_id']
    const action = deleteUsersStart(userIds, UsersMockApi)

    it('should call delete users method', () => {
      return expectSaga(deleteUsersSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.deleteUsers), {}]])
        .call(UsersMockApi.deleteUsers, userIds)
        .put(deleteUsersSuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(deleteUsersSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.deleteUsers), throwError(error)]])
        .put(deleteUsersError(error))
        .run()
    })
  })

  describe('getUserDevicesSaga', () => {
    const userId = 'test_id'
    const action = getUserDevicesStart(userId, UsersMockApi)
    it('should fetch user devices', () => {
      return expectSaga(getUserDevicesSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserDevices), { data: UserDevicesResponseMock }]])
        .call(UsersMockApi.getUserDevices, userId)
        .put(getUserDevicesSuccess(UserDevicesResponseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserDevicesSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUserDevices), throwError(error)]])
        .put(getUserDevicesError(error))
        .run()
    })
  })

  describe('getUserDevicePersonaModelsSaga', () => {
    const mockParams = {
      userId: 'user-id',
      deviceId: 'device-id',
    }
    const action = getUserDevicePersonaModelsStart(mockParams, ModelsMockApi)
    it('should fetch user device models statuses', () => {
      return expectSaga(getUserDevicePersonaModelsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getPersonaModels), { data: GetPersonaModelsResponseMock }]])
        .call(ModelsMockApi.getPersonaModels, mockParams)
        .put(getUserDevicePersonaModelsSuccess(mockParams.deviceId, GetPersonaModelsResponseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserDevicePersonaModelsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getPersonaModels), throwError(error)]])
        .put(getUserDevicePersonaModelsError(mockParams.deviceId, error))
        .run()
    })
  })

  describe('updateUserDevicePersonaModelsSaga', () => {
    const mockParams = {
      userId: 'user-id',
      deviceId: 'device-id',
      command: PersonaModelCommand.PAUSE,
      models: [PersonaModelType.META],
    }
    const action = updateUserDevicePersonaModelsStart(mockParams, ModelsMockApi)
    it('should update models statuses', () => {
      return expectSaga(updateUserDevicePersonaModelsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.updatePersonaModel), {}]])
        .call(ModelsMockApi.updatePersonaModel, mockParams)
        .put(updateUserDevicePersonaModelsSuccess(mockParams))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(updateUserDevicePersonaModelsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.updatePersonaModel), throwError(error)]])
        .put(updateUserDevicePersonaModelsError(mockParams, error))
        .run()
    })
  })

  describe('getUserActiveAlertsSaga', () => {
    const params = { userId: 'test_user_id' }
    const expectedParams = {
      filters: [{ userId: params.userId }, { status: [PersonaAlertStatus.NEW, PersonaAlertStatus.IN_PROGRESS] }],
    }
    const action = getUserActiveAlertsStart(params, AlertsMockApi)
    const responseMock = getAlertListResponse({ includeMeta: false })
    it('should fetch user active alerts', () => {
      return expectSaga(getUserActiveAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), { data: responseMock }]])
        .call(AlertsMockApi.getAlertList, expectedParams)
        .put(getUserActiveAlertsSuccess(responseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserActiveAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), throwError(error)]])
        .put(getUserActiveAlertsError(error))
        .run()
    })
  })

  describe('getUserHistoryAlertsSaga', () => {
    const params = { userId: 'test_user_id' }
    const expectedParams = {
      filters: [{ userId: params.userId }, { status: [PersonaAlertStatus.REVIEWED, PersonaAlertStatus.FALSE_POSITIVE] }],
    }
    const action = getUserHistoryAlertsStart(params, AlertsMockApi)
    const responseMock = getAlertListResponse({ includeMeta: false })
    it('should fetch user active alerts', () => {
      return expectSaga(getUserHistoryAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), { data: responseMock }]])
        .call(AlertsMockApi.getAlertList, expectedParams)
        .put(getUserHistoryAlertsSuccess(responseMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserHistoryAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), throwError(error)]])
        .put(getUserHistoryAlertsError(error))
        .run()
    })
  })

  describe('getUserPersonaScoreLogSaga', () => {
    const mockDeviceId = 'mock_device_id'
    const mockParams1 = {
      fromTime: '04/04/4040',
      toTime: '05/05/5050',
      userId: 'testUserId',
      deviceId: mockDeviceId,
      scoreType: PersonaScoreType.META,
    }
    const mockParams2 = {
      fromTime: '03/03/3030',
      toTime: '06/06/6060',
      userId: 'testUserId',
      deviceId: mockDeviceId,
      scoreType: PersonaScoreType.KEYBOARD,
    }
    const params = [
      {
        interval: PersonaScoreChartInterval.Last30Days,
        params: mockParams1,
      },
      {
        interval: PersonaScoreChartInterval.Last30Days,
        params: mockParams2,
      },
    ]
    const mockResponse = [
      {
        timestamp: '01/01/2021',
        score: 100,
        scoreType: PersonaScoreType.KEYBOARD,
      },
      {
        timestamp: '02/01/2021',
        score: 80,
        scoreType: PersonaScoreType.KEYBOARD,
      },
    ]
    const expectedData = {
      ...DEFAULT_PERSONA_SCORE_DATA,
      [PersonaScoreChartInterval.Last30Days]: {
        ...DEFAULT_PERSONA_SCORE_DATA[PersonaScoreChartInterval.Last30Days],
        [PersonaScoreType.META]: mockResponse,
        [PersonaScoreType.KEYBOARD]: mockResponse,
      },
    }

    const action = getUserPersonaScoreLogStart(mockDeviceId, params, AlertsMockApi)

    it('should fetch and transform user score log data', () => {
      return expectSaga(getUserPersonaScoreLogSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getScoreLog), { data: mockResponse }]])
        .call(AlertsMockApi.getScoreLog, mockParams1)
        .call(AlertsMockApi.getScoreLog, mockParams2)
        .put(getUserPersonaScoreLogSuccess(mockDeviceId, expectedData))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserPersonaScoreLogSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getScoreLog), throwError(error)]])
        .put(getUserPersonaScoreLogError(mockDeviceId, error))
        .run()
    })
  })

  describe('getUserAlertsWithTrustScoreSaga', () => {
    const mockDeviceId = 'mock_device_id'
    const params = {
      interval: PersonaScoreChartInterval.Last24Hours,
      params: {
        fromTime: '04/04/4040',
        toTime: '05/05/5050',
        userId: 'testUserId',
        deviceId: mockDeviceId,
        sort: 'testSort',
      },
    }
    const mockResponse = [
      {
        id: 'test id 1',
        timestamp: '10/10/1010',
        eventId: 1234,
        severity: 1,
        trustScore: 100,
      },
      {
        id: 'test id 2',
        timestamp: '20/20/2020',
        eventId: 5678,
        severity: 2,
        trustScore: 50,
      },
    ]
    const expectedData = {
      ...DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA,
      [PersonaScoreChartInterval.Last24Hours]: mockResponse,
    }

    const action = getUserAlertsWithTrustScoreStart(params, AlertsMockApi)

    it('should fetch and transform user alerts with trustscore', () => {
      return expectSaga(getUserAlertsWithTrustScoreSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertsWithTrustScore), { data: mockResponse }]])
        .call(AlertsMockApi.getAlertsWithTrustScore, params.params)
        .put(getUserAlertsWithTrustScoreSuccess(mockDeviceId, expectedData))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getUserAlertsWithTrustScoreSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertsWithTrustScore), throwError(error)]])
        .put(getUserAlertsWithTrustScoreError(mockDeviceId, error))
        .run()
    })
  })

  describe('getScoreForSelectedAlertsSaga', () => {
    const params = {
      alertId: 'testAlertId',
      deviceId: 'testDeviceId',
    }
    const mockResponse = [
      {
        id: 'test id 1',
        timestamp: '10/10/1010',
        eventId: 1234,
        severity: 1,
        trustScore: 100,
      },
      {
        id: 'test id 2',
        timestamp: '20/20/2020',
        eventId: 5678,
        severity: 2,
        trustScore: 50,
      },
    ]

    const action = getScoresForSelectedAlertStart(params, AlertsMockApi)

    it('should fetch and transform selected alert score data', () => {
      return expectSaga(getScoreForSelectedAlertsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getScoresForAlert), { data: mockResponse }]])
        .call(AlertsMockApi.getScoresForAlert, params.alertId)
        .put(getScoresForSelectedAlertSuccess(params.deviceId, mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getScoreForSelectedAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getScoresForAlert), throwError(error)]])
        .put(getScoresForSelectedAlertError(params.deviceId, error))
        .run()
    })
  })

  describe('searchUsersByUsernameSaga', () => {
    const params = {
      userName: 'test user',
    }
    const mockResponse = UserContainsUsernameResponseMock
    const action = searchUsersByUsernameStart(params, UsersMockApi)

    it('sshould fetch users suggestions list', () => {
      return expectSaga(searchUsersByUsernameSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUsersContainingUsername), { data: mockResponse }]])
        .call(UsersMockApi.getUsersContainingUsername, params)
        .put(searchUsersByUsernameSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(searchUsersByUsernameSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getUsersContainingUsername), throwError(error)]])
        .put(searchUsersByUsernameError(error))
        .run()
    })
  })

  describe('searchZonesByNameSaga', () => {
    const zoneName = 'zone_name'
    const mockResponse = ZonesResponseMock
    const action = searchZonesByNameStart(zoneName, ZonesMockApi)

    it('should fetch zones suggestions list', () => {
      return expectSaga(searchZonesByNameSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getZonesByName), { data: mockResponse }]])
        .call(ZonesMockApi.getZonesByName, zoneName)
        .put(searchZonesByNameSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(searchZonesByNameSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getZonesByName), throwError(error)]])
        .put(searchZonesByNameError(error))
        .run()
    })
  })

  describe('searchDevicesByDeviceNameSaga', () => {
    const queryString = 'test device'
    const mockResponse = DeviceContainsDeviceNameResponseMock
    const action = searchDevicesByDeviceNameStart(queryString, UsersMockApi)

    it('should fetch device suggestions list by device name', () => {
      return expectSaga(searchDevicesByDeviceNameSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.getDeviceContainsDeviceName), { data: mockResponse }]])
        .call(UsersMockApi.getDeviceContainsDeviceName, queryString)
        .put(searchDevicesByDeviceNameSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(searchDevicesByDeviceNameSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getDeviceContainsDeviceName), throwError(error)]])
        .put(searchDevicesByDeviceNameError(error))
        .run()
    })
  })
})
