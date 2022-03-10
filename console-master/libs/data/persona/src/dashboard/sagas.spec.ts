import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { AlertsMockApi, PersonaAlertType } from '../alert-service'
import {
  AlertDetailsMockResponse,
  GetAlertHistoryAndCommentsResponse,
  getAlertListResponse,
} from '../alert-service/alerts-mock.data'
import { PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP } from '../constants'
import type { StatisticsTimeInterval } from '../types'
import { UsersMockApi } from '../user-service'
import { PersonaTenantTopLowerTrustScoreUsersMockResponse, UserContainsUsernameResponseMock } from '../user-service/users-mock.data'
import { ZonesMockApi, ZonesResponseMock } from '../zone-service'
import {
  addAlertCommentError,
  addAlertCommentStart,
  addAlertCommentSuccess,
  deleteAlertCommentError,
  deleteAlertCommentStart,
  deleteAlertCommentSuccess,
  getAlertCommentsError,
  getAlertCommentsStart,
  getAlertCommentsSuccess,
  getAlertDetailsError,
  getAlertDetailsStart,
  getAlertDetailsSuccess,
  getAlertListError,
  getAlertListStart,
  getAlertListSuccess,
  getRelatedAlertsError,
  getRelatedAlertsStart,
  getRelatedAlertsSuccess,
  getTenantAlertCountsError,
  getTenantAlertCountsStart,
  getTenantAlertCountsSuccess,
  getTenantLowestTrustScoreUsersError,
  getTenantLowestTrustScoreUsersStart,
  getTenantLowestTrustScoreUsersSuccess,
  getTenantOnlineDeviceCountsError,
  getTenantOnlineDeviceCountsStart,
  getTenantOnlineDeviceCountsSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameStart,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameStart,
  searchZonesByNameSuccess,
  updateAlertStatusError,
  updateAlertStatusStart,
  updateAlertStatusSuccess,
} from './actions'
import { defaultState } from './reducer'
import {
  addAlertCommentSaga,
  deleteAlertCommentSaga,
  getAlertCommentsSaga,
  getAlertDetailsSaga,
  getAlertListSaga,
  getRelatedAlertsSaga,
  getTenantAlertCountsSaga,
  getTenantLowestTrustScoreUsersSaga,
  getTenantOnlineDeviceCountsSaga,
  searchUsersByUsernameSaga,
  searchZonesByNameSaga,
  updateAlertStatusSaga,
} from './sagas'
import { DashboardReduxSlice } from './types'

describe(`${DashboardReduxSlice} sagas`, () => {
  const mockStateObj = { [DashboardReduxSlice]: defaultState }

  describe('getAlertListSaga', () => {
    const params = { page: 1 }
    const action = getAlertListStart(params, AlertsMockApi)

    it('should fetch alerts list', () => {
      const expectedParams = { ...params, includeMeta: true }
      const mockResponse = getAlertListResponse({ includeMeta: true })
      return expectSaga(getAlertListSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), { data: mockResponse }]])
        .call(AlertsMockApi.getAlertList, expectedParams)
        .put(getAlertListSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getAlertListSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), throwError(error)]])
        .put(getAlertListError(error))
        .run()
    })
  })

  describe('getAlertDetailsSaga', () => {
    const alertId = 'mock_alert_id'
    const action = getAlertDetailsStart(alertId, AlertsMockApi)

    it('should fetch alerts list', () => {
      return expectSaga(getAlertDetailsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertDetails), { data: AlertDetailsMockResponse }]])
        .call(AlertsMockApi.getAlertDetails, alertId)
        .put(getAlertDetailsSuccess(AlertDetailsMockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getAlertDetailsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertDetails), throwError(error)]])
        .put(getAlertDetailsError(error))
        .run()
    })
  })

  describe('updateAlertStatusSaga', () => {
    const mockParams = []
    const action = updateAlertStatusStart(mockParams, AlertsMockApi)

    it('should update alerts status', () => {
      return expectSaga(updateAlertStatusSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.updateAlertStatus), { data: AlertDetailsMockResponse }]])
        .call(AlertsMockApi.updateAlertStatus, mockParams)
        .put(updateAlertStatusSuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(updateAlertStatusSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.updateAlertStatus), throwError(error)]])
        .put(updateAlertStatusError(error))
        .run()
    })
  })

  describe('getRelatedAlertsSaga', () => {
    const params = { alertId: 'alert_id', page: 1 }
    const action = getRelatedAlertsStart(params, AlertsMockApi)

    it('should fetch related alerts list', () => {
      const mockResponse = getAlertListResponse({ includeMeta: false })
      return expectSaga(getRelatedAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), { data: mockResponse }]])
        .call(AlertsMockApi.getAlertList, params)
        .put(getRelatedAlertsSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getRelatedAlertsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertList), throwError(error)]])
        .put(getRelatedAlertsError(error))
        .run()
    })
  })

  describe('getAlertCommentsSaga', () => {
    const alertId = 'alert_id'
    const action = getAlertCommentsStart(alertId, AlertsMockApi)

    it('should alert comments list', () => {
      return expectSaga(getAlertCommentsSaga, action)
        .provide([
          [matchers.call.fn(action.payload.apiProvider.getAlertHistoryAndComments), { data: GetAlertHistoryAndCommentsResponse }],
        ])
        .call(AlertsMockApi.getAlertHistoryAndComments, alertId)
        .put(getAlertCommentsSuccess(GetAlertHistoryAndCommentsResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getAlertCommentsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getAlertHistoryAndComments), throwError(error)]])
        .put(getAlertCommentsError(error))
        .run()
    })
  })

  describe('addAlertCommentSaga', () => {
    const params = {
      alertId: 'alert_id',
      ownerId: 'owner_id',
      ownerName: 'owner_name',
      content: 'comment_content',
    }
    const action = addAlertCommentStart(params, AlertsMockApi)

    it('should make add comment request', () => {
      return expectSaga(addAlertCommentSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.addAlertComment), { data: {} }]])
        .call(AlertsMockApi.addAlertComment, params)
        .put(addAlertCommentSuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(addAlertCommentSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.addAlertComment), throwError(error)]])
        .put(addAlertCommentError(error))
        .run()
    })
  })

  describe('deleteAlertCommentSaga', () => {
    const commentId = 'comment_id'
    const action = deleteAlertCommentStart(commentId, AlertsMockApi)

    it('should make delete comment request', () => {
      return expectSaga(deleteAlertCommentSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.deleteAlertComment), { data: {} }]])
        .call(AlertsMockApi.deleteAlertComment, commentId)
        .put(deleteAlertCommentSuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(deleteAlertCommentSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.deleteAlertComment), throwError(error)]])
        .put(deleteAlertCommentError(error))
        .run()
    })
  })

  describe('getTenantAlertCountsSaga', () => {
    const params = {
      fromTime: '2021-10-05T15:28:42.142Z',
      toTime: '2021-11-05T15:28:42.142Z',
      interval: 'day' as StatisticsTimeInterval,
      alertTypes: [PersonaAlertType.FAILED_MFA, PersonaAlertType.FORCED_MFA],
    }
    const action = getTenantAlertCountsStart(params, AlertsMockApi)

    it('should get tenant alert counts', () => {
      const expectedParams = [
        {
          fromTime: params.fromTime,
          toTime: params.toTime,
          interval: params.interval,
          alertableType: PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP[PersonaAlertType.FAILED_MFA],
        },
        {
          fromTime: params.fromTime,
          toTime: params.toTime,
          interval: params.interval,
          alertableType: PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP[PersonaAlertType.FORCED_MFA],
        },
      ]
      const mockResItem = {
        timestamp: '2021-10-05T15:28:42.142Z',
        count: 42,
      }
      const mockResponse = {
        count: [mockResItem],
      }
      const expectedPayload = {
        [PersonaAlertType.FAILED_MFA]: [mockResItem],
        [PersonaAlertType.FORCED_MFA]: [mockResItem],
      }
      return expectSaga(getTenantAlertCountsSaga, action)
        .provide([
          [
            matchers.call.fn(action.payload.apiProvider.getTenantAlertsCountForAlertType),
            {
              data: mockResponse,
            },
          ],
        ])
        .call(AlertsMockApi.getTenantAlertsCountForAlertType, expectedParams[0])
        .call(AlertsMockApi.getTenantAlertsCountForAlertType, expectedParams[1])
        .put(getTenantAlertCountsSuccess(expectedPayload))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getTenantAlertCountsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getTenantAlertsCountForAlertType), throwError(error)]])
        .put(getTenantAlertCountsError(error))
        .run()
    })
  })

  describe('getTenantOnlineDeviceCountsSaga', () => {
    const params = {
      fromTime: '2021-10-05T15:28:42.142Z',
      toTime: '2021-11-05T15:28:42.142Z',
      interval: 'day' as StatisticsTimeInterval,
    }
    const action = getTenantOnlineDeviceCountsStart(params, UsersMockApi)

    it('should get tenant online counts', () => {
      const mockResItem = {
        timestamp: '2021-10-05T15:28:42.142Z',
        count: 42,
      }
      const mockResponse = {
        count: [mockResItem],
      }
      return expectSaga(getTenantOnlineDeviceCountsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getTenantDeviceOnlineCount), { data: mockResponse }]])
        .call(UsersMockApi.getTenantDeviceOnlineCount, params)
        .put(getTenantOnlineDeviceCountsSuccess(mockResponse.count))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getTenantOnlineDeviceCountsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getTenantDeviceOnlineCount), throwError(error)]])
        .put(getTenantOnlineDeviceCountsError(error))
        .run()
    })
  })

  describe('getTenantLowestTrustScoreUsersSaga', () => {
    const action = getTenantLowestTrustScoreUsersStart(UsersMockApi)

    it('should get tenant lowest trust score users', () => {
      const mockResponse = PersonaTenantTopLowerTrustScoreUsersMockResponse
      return expectSaga(getTenantLowestTrustScoreUsersSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getTenantTopLowestTrustScoreUsers), { data: mockResponse }]])
        .call(UsersMockApi.getTenantTopLowestTrustScoreUsers)
        .put(getTenantLowestTrustScoreUsersSuccess(mockResponse))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(getTenantLowestTrustScoreUsersSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.getTenantTopLowestTrustScoreUsers), throwError(error)]])
        .put(getTenantLowestTrustScoreUsersError(error))
        .run()
    })
  })

  describe('searchUsersByUsernameSaga', () => {
    const params = {
      userName: 'test user',
    }
    const mockResponse = UserContainsUsernameResponseMock
    const action = searchUsersByUsernameStart(params, UsersMockApi)

    it('should fetch and transform user alerts with trustscore', () => {
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

    it('should fetch and transform user alerts with trustscore', () => {
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
})
