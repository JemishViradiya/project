import type { Response } from '@ues-data/shared-types'

import type { StatisticsCountResponse } from '../types'
import type AlertInterface from './alert-interface'
import {
  AlertDetailsMockResponse,
  GetAlertHistoryAndCommentsResponse,
  getAlertListResponse,
  getAlertsWithTrustScoreResponse,
  getPersonaTenantAlertsCountResponse,
  getScoreLogResponse,
  GetScoresForAlertResponse,
} from './alerts-mock.data'
import type {
  AddAlertCommentParams,
  AlertCommentItem,
  AlertDetails,
  AlertListResponse,
  GetAlertListParams,
  GetAlertsWithTrustScoreParams,
  GetPersonaScoreLogParams,
  GetTenantAlertsCountForAlertTypeParams,
  PersonaAlertWithTrustScoreItem,
  PersonaScoreLogItem,
  UpdateAlertStatusParams,
} from './alerts-types'

class AlertsMockClass implements AlertInterface {
  getAlertList(params: GetAlertListParams): Response<AlertListResponse> {
    console.log('AlertsMockApi -> getAlertList', { params })
    return Promise.resolve({ data: getAlertListResponse(params) })
  }
  getAlertDetails(alertId: string): Response<AlertDetails> {
    console.log('AlertsMockApi -> getAlertDetails', { alertId })
    return Promise.resolve({ data: AlertDetailsMockResponse })
  }
  updateAlertStatus(params: UpdateAlertStatusParams[]): Response<unknown> {
    console.log('AlertsMockApi -> updateAlertStatus', { params })
    return Promise.resolve({ data: {} })
  }
  getAlertsWithTrustScore(params: GetAlertsWithTrustScoreParams): Response<PersonaAlertWithTrustScoreItem[]> {
    console.log('AlertsMockApi -> getAlertsWithTrustScore', { params })
    return Promise.resolve({ data: getAlertsWithTrustScoreResponse(params) })
  }
  getScoreLog(params: GetPersonaScoreLogParams): Response<PersonaScoreLogItem[]> {
    console.log('AlertsMockApi -> getScoreLog', { params })
    return Promise.resolve({ data: getScoreLogResponse(params) })
  }
  getScoresForAlert(alertId: string): Response<PersonaScoreLogItem[]> {
    console.log('AlertsMockApi -> getScoresForAlert', { alertId })
    return Promise.resolve({ data: GetScoresForAlertResponse })
  }
  getAlertHistoryAndComments(alertId: string): Response<AlertCommentItem[]> {
    console.log('AlertsMockApi -> getAlertHistoryAndComments', { alertId })
    return Promise.resolve({ data: GetAlertHistoryAndCommentsResponse })
  }
  addAlertComment(params: AddAlertCommentParams): Response<unknown> {
    console.log('AlertsMockApi -> addAlertComment', { params })
    return Promise.resolve({ data: {} })
  }
  deleteAlertComment(commentId: string): Response<unknown> {
    console.log('AlertsMockApi -> deleteAlertComment', { commentId })
    return Promise.resolve({ data: {} })
  }
  getTenantAlertsCountForAlertType(params: GetTenantAlertsCountForAlertTypeParams): Response<StatisticsCountResponse> {
    console.log('AlertsMockApi -> getTenantAlertsCountForAlertType', { params })
    return Promise.resolve({ data: getPersonaTenantAlertsCountResponse(params) })
  }
}

const AlertsMockApi = new AlertsMockClass()

export { AlertsMockApi }
