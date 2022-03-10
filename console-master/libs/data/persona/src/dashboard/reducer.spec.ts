import { AlertDetailsMockResponse, getAlertListResponse } from '../alert-service/alerts-mock.data'
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
  getScoresForSelectedAlertError,
  getScoresForSelectedAlertStart,
  getScoresForSelectedAlertSuccess,
  getTenantAlertCountsError,
  getTenantAlertCountsStart,
  getTenantAlertCountsSuccess,
  getTenantLowestTrustScoreUsersError,
  getTenantLowestTrustScoreUsersStart,
  getTenantLowestTrustScoreUsersSuccess,
  getTenantOnlineDeviceCountsError,
  getTenantOnlineDeviceCountsStart,
  getTenantOnlineDeviceCountsSuccess,
  getUserAlertsWithTrustScoreError,
  getUserAlertsWithTrustScoreStart,
  getUserAlertsWithTrustScoreSuccess,
  getUserPersonaScoreLogError,
  getUserPersonaScoreLogStart,
  getUserPersonaScoreLogSuccess,
  searchUsersByUsernameError,
  searchUsersByUsernameReset,
  searchUsersByUsernameStart,
  searchUsersByUsernameSuccess,
  searchZonesByNameError,
  searchZonesByNameReset,
  searchZonesByNameStart,
  searchZonesByNameSuccess,
  updateAlertStatusError,
  updateAlertStatusStart,
  updateAlertStatusSuccess,
} from './actions'
import reducer, { defaultState } from './reducer'
import { DashboardActionType, DashboardReduxSlice, DashboardTaskId } from './types'

describe(`${DashboardReduxSlice} reducer`, () => {
  const mockApiProvider: any = {}

  describe(`${DashboardTaskId.Alerts}`, () => {
    describe(`${DashboardActionType.GetAlertListStart}`, () => {
      it(`should set ${DashboardTaskId.Alerts} loading state to true`, () => {
        const mockParams: any = {}
        const action = getAlertListStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.Alerts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetAlertListSuccess}`, () => {
      it(`should set ${DashboardTaskId.Alerts} loading state to false and add data`, () => {
        const mockResponse = getAlertListResponse({ includeMeta: true })
        const action = getAlertListSuccess(mockResponse)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.Alerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.Alerts]: {
              loading: false,
              result: mockResponse,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetAlertListError}`, () => {
      it(`should set ${DashboardTaskId.Alerts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getAlertListError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.Alerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.Alerts]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.AlertDetails}`, () => {
    describe(`${DashboardActionType.GetAlertDetailsStart}`, () => {
      it(`should set ${DashboardTaskId.AlertDetails} loading state to true`, () => {
        const mockParams: any = {}
        const action = getAlertDetailsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertDetails]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetAlertDetailsSuccess}`, () => {
      it(`should set ${DashboardTaskId.AlertDetails} loading state to false and add data`, () => {
        const action = getAlertDetailsSuccess(AlertDetailsMockResponse)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertDetails]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertDetails]: {
              loading: false,
              result: AlertDetailsMockResponse,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetAlertDetailsError}`, () => {
      it(`should set ${DashboardTaskId.AlertDetails} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getAlertDetailsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertDetails]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertDetails]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.UserPersonaScoreLog}`, () => {
    describe(`${DashboardActionType.GetUserPersonaScoreLogStart}`, () => {
      it(`should set ${DashboardTaskId.UserPersonaScoreLog} loading state to true`, () => {
        const mockParams: any = {}
        const action = getUserPersonaScoreLogStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserPersonaScoreLog]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetUserPersonaScoreLogSuccess}`, () => {
      it(`should set ${DashboardTaskId.UserPersonaScoreLog} loading state to false and add data`, () => {
        const mockResp: any = {
          foo: 'bar',
        }
        const action = getUserPersonaScoreLogSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UserPersonaScoreLog]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserPersonaScoreLog]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetUserPersonaScoreLogError}`, () => {
      it(`should set ${DashboardTaskId.UserPersonaScoreLog} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserPersonaScoreLogError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UserPersonaScoreLog]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserPersonaScoreLog]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.UserAlertsWithTrustScore}`, () => {
    describe(`${DashboardActionType.GetUserAlertsWithTrustScoreStart}`, () => {
      it(`should set ${DashboardTaskId.UserAlertsWithTrustScore} loading state to true`, () => {
        const mockParams: any = {}
        const action = getUserAlertsWithTrustScoreStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserAlertsWithTrustScore]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetUserAlertsWithTrustScoreSuccess}`, () => {
      it(`should set ${DashboardTaskId.UserAlertsWithTrustScore} loading state to false and add data`, () => {
        const mockResp: any = {
          foo: 'bar',
        }
        const action = getUserAlertsWithTrustScoreSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UserAlertsWithTrustScore]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserAlertsWithTrustScore]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetUserAlertsWithTrustScoreError}`, () => {
      it(`should set ${DashboardTaskId.UserAlertsWithTrustScore} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getUserAlertsWithTrustScoreError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UserAlertsWithTrustScore]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UserAlertsWithTrustScore]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.ScoresForSelectedAlert}`, () => {
    describe(`${DashboardActionType.GetScoresForSelectedAlertStart}`, () => {
      it(`should set ${DashboardTaskId.ScoresForSelectedAlert} loading state to true`, () => {
        const mockParams: any = {}
        const action = getScoresForSelectedAlertStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.ScoresForSelectedAlert]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetScoresForSelectedAlertSuccess}`, () => {
      it(`should set ${DashboardTaskId.ScoresForSelectedAlert} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getScoresForSelectedAlertSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.ScoresForSelectedAlert]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.ScoresForSelectedAlert]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetUserAlertsWithTrustScoreError}`, () => {
      it(`should set ${DashboardTaskId.ScoresForSelectedAlert} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getScoresForSelectedAlertError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.ScoresForSelectedAlert]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.ScoresForSelectedAlert]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.UpdateAlertStatus}`, () => {
    describe(`${DashboardActionType.UpdateAlertStatusStart}`, () => {
      it(`should set ${DashboardTaskId.UpdateAlertStatus} loading state to true`, () => {
        const mockParams: any = {}
        const action = updateAlertStatusStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UpdateAlertStatus]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.UpdateAlertStatusSuccess}`, () => {
      it(`should set ${DashboardTaskId.UpdateAlertStatus} loading state to false and add data`, () => {
        const action = updateAlertStatusSuccess()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UpdateAlertStatus]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UpdateAlertStatus]: {
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.UpdateAlertStatusError}`, () => {
      it(`should set ${DashboardTaskId.UpdateAlertStatus} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = updateAlertStatusError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.UpdateAlertStatus]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.UpdateAlertStatus]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.AlertRelatedAlerts}`, () => {
    describe(`${DashboardActionType.GetRelatedAlersStart}`, () => {
      it(`should set ${DashboardTaskId.AlertRelatedAlerts} loading state to true`, () => {
        const mockParams: any = {}
        const action = getRelatedAlertsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertRelatedAlerts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetRelatedAlersSuccess}`, () => {
      it(`should set ${DashboardTaskId.AlertRelatedAlerts} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getRelatedAlertsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertRelatedAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertRelatedAlerts]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetRelatedAlersError}`, () => {
      it(`should set ${DashboardTaskId.AlertRelatedAlerts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getRelatedAlertsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertRelatedAlerts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertRelatedAlerts]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.AlertComments}`, () => {
    describe(`${DashboardActionType.GetAlertCommentsStart}`, () => {
      it(`should set ${DashboardTaskId.AlertComments} loading state to true`, () => {
        const mockParams: any = {}
        const action = getAlertCommentsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertComments]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetRelatedAlersSuccess}`, () => {
      it(`should set ${DashboardTaskId.AlertComments} loading state to false and add data`, () => {
        const mockResp: any = {
          device_id: {
            foo: 'bar',
          },
        }
        const action = getAlertCommentsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertComments]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertComments]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetRelatedAlersError}`, () => {
      it(`should set ${DashboardTaskId.AlertComments} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getAlertCommentsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AlertComments]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AlertComments]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.AddAlertComment}`, () => {
    describe(`${DashboardActionType.AddAlertCommentStart}`, () => {
      it(`should set ${DashboardTaskId.AddAlertComment} loading state to true`, () => {
        const mockParams: any = {}
        const action = addAlertCommentStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AddAlertComment]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.AddAlertCommentSuccess}`, () => {
      it(`should set ${DashboardTaskId.AddAlertComment} loading state to false`, () => {
        const action = addAlertCommentSuccess()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AddAlertComment]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AddAlertComment]: {
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.AddAlertCommentError}`, () => {
      it(`should set ${DashboardTaskId.AddAlertComment} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = addAlertCommentError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.AddAlertComment]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.AddAlertComment]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.DeleteAlertComment}`, () => {
    describe(`${DashboardActionType.DeleteAlertCommentStart}`, () => {
      it(`should set ${DashboardTaskId.DeleteAlertComment} loading state to true`, () => {
        const mockParams: any = {}
        const action = deleteAlertCommentStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.DeleteAlertComment]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.DeleteAlertCommentSuccess}`, () => {
      it(`should set ${DashboardTaskId.DeleteAlertComment} loading state to false`, () => {
        const action = deleteAlertCommentSuccess()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.DeleteAlertComment]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.DeleteAlertComment]: {
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.DeleteAlertCommentError}`, () => {
      it(`should set ${DashboardTaskId.DeleteAlertComment} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = deleteAlertCommentError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.DeleteAlertComment]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.DeleteAlertComment]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.TenantAlertCounts}`, () => {
    describe(`${DashboardActionType.GetTenantAlertCountsStart}`, () => {
      it(`should set ${DashboardTaskId.TenantAlertCounts} loading state to true`, () => {
        const mockParams: any = {}
        const action = getTenantAlertCountsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantAlertCounts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantAlertCountsSuccess}`, () => {
      it(`should set ${DashboardTaskId.TenantAlertCounts} loading state to false and add data`, () => {
        const mockResp: any = []
        const action = getTenantAlertCountsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantAlertCounts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantAlertCounts]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantAlertCountsError}`, () => {
      it(`should set ${DashboardTaskId.TenantAlertCounts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getTenantAlertCountsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantAlertCounts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantAlertCounts]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.TenantOnlineDeviceCounts}`, () => {
    describe(`${DashboardActionType.GetTenantOnlineDeviceCountsStart}`, () => {
      it(`should set ${DashboardTaskId.TenantOnlineDeviceCounts} loading state to true`, () => {
        const mockParams: any = {}
        const action = getTenantOnlineDeviceCountsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantOnlineDeviceCounts]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantOnlineDeviceCountsSuccess}`, () => {
      it(`should set ${DashboardTaskId.TenantOnlineDeviceCounts} loading state to false and add data`, () => {
        const mockResp: any = []
        const action = getTenantOnlineDeviceCountsSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantOnlineDeviceCounts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantOnlineDeviceCounts]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantOnlineDeviceCountsError}`, () => {
      it(`should set ${DashboardTaskId.TenantOnlineDeviceCounts} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getTenantOnlineDeviceCountsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantOnlineDeviceCounts]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantOnlineDeviceCounts]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.TenantLowestTrustScoreUsers}`, () => {
    describe(`${DashboardActionType.GetTenantLowestTrustScoreUsersStart}`, () => {
      it(`should set ${DashboardTaskId.TenantLowestTrustScoreUsers} loading state to true`, () => {
        const action = getTenantLowestTrustScoreUsersStart(mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantLowestTrustScoreUsers]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantLowestTrustScoreUsersSuccess}`, () => {
      it(`should set ${DashboardTaskId.TenantLowestTrustScoreUsers} loading state to false and add data`, () => {
        const mockResp: any = []
        const action = getTenantLowestTrustScoreUsersSuccess(mockResp)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantLowestTrustScoreUsers]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantLowestTrustScoreUsers]: {
              loading: false,
              result: mockResp,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.GetTenantLowestTrustScoreUsersError}`, () => {
      it(`should set ${DashboardTaskId.TenantLowestTrustScoreUsers} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = getTenantLowestTrustScoreUsersError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.TenantLowestTrustScoreUsers]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.TenantLowestTrustScoreUsers]: {
              loading: false,
              error,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.SearchUsersByUsernameData}`, () => {
    describe(`${DashboardActionType.SearchUsersByUsernameStart}`, () => {
      it(`should set ${DashboardTaskId.SearchUsersByUsernameData} loading state to true`, () => {
        const mockParams = { userName: 'mock_username' }
        const action = searchUsersByUsernameStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchUsersByUsernameSuccess}`, () => {
      it(`should set ${DashboardTaskId.SearchUsersByUsernameData} loading state to false and add data`, () => {
        const mockResponse: any = {}
        const action = searchUsersByUsernameSuccess(mockResponse)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: false,
              result: mockResponse,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchUsersByUsernameError}`, () => {
      it(`should set ${DashboardTaskId.SearchUsersByUsernameData} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = searchUsersByUsernameError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchUsersByUsernameData]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchUsersByUsernameReset}`, () => {
      it(`should set ${DashboardTaskId.SearchUsersByUsernameData} reset state`, () => {
        const action = searchUsersByUsernameReset()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchUsersByUsernameData]: {
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${DashboardTaskId.SearchZonesByNameData}`, () => {
    describe(`${DashboardActionType.SearchZonesByNameStart}`, () => {
      it(`should set ${DashboardTaskId.SearchZonesByNameData} loading state to true`, () => {
        const zoneName = 'zone_name'
        const action = searchZonesByNameStart(zoneName, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchZonesByNameSuccess}`, () => {
      it(`should set ${DashboardTaskId.SearchZonesByNameData} loading state to false and add data`, () => {
        const mockResponse: any = {}
        const action = searchZonesByNameSuccess(mockResponse)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: false,
              result: mockResponse,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchZonesByNameError}`, () => {
      it(`should set ${DashboardTaskId.SearchZonesByNameData} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = searchZonesByNameError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchZonesByNameData]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })

    describe(`${DashboardActionType.SearchZonesByNameReset}`, () => {
      it(`should set ${DashboardTaskId.SearchZonesByNameData} reset state`, () => {
        const action = searchZonesByNameReset()
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: true,
              result: [],
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [DashboardTaskId.SearchZonesByNameData]: {
              loading: false,
            },
          }),
        )
      })
    })
  })
})
