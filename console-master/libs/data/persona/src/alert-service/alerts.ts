import type { Response } from '@ues-data/shared-types'

import { axiosInstance, personaAlertsBaseUrl, personaScoresBaseUrl } from '../config.rest'
import type { StatisticsCountResponse } from '../types'
import { paramsSerializer, transformListRequestParams } from '../utils'
import type AlertInterface from './alert-interface'
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

class AlertsClass implements AlertInterface {
  getAlertList(params: GetAlertListParams): Response<AlertListResponse> {
    const queryParams = transformListRequestParams(params)
    return axiosInstance().get(personaAlertsBaseUrl, { params: queryParams, paramsSerializer })
  }
  getAlertDetails(alertId: string): Response<AlertDetails> {
    return axiosInstance().get(`${personaAlertsBaseUrl}/${alertId}`)
  }
  updateAlertStatus(params: UpdateAlertStatusParams[]): Response<unknown> {
    return axiosInstance().put(personaAlertsBaseUrl, params)
  }
  getAlertsWithTrustScore(params: GetAlertsWithTrustScoreParams): Response<PersonaAlertWithTrustScoreItem[]> {
    return axiosInstance().get(`${personaAlertsBaseUrl}/trustScore`, { params, paramsSerializer })
  }
  getScoreLog(params: GetPersonaScoreLogParams): Response<PersonaScoreLogItem[]> {
    return axiosInstance().get(personaScoresBaseUrl, { params, paramsSerializer })
  }
  getScoresForAlert(alertId: string): Response<PersonaScoreLogItem[]> {
    return axiosInstance().get(`${personaAlertsBaseUrl}/${alertId}/scores`)
  }
  getAlertHistoryAndComments(alertId: string): Response<AlertCommentItem[]> {
    return axiosInstance().get(`${personaAlertsBaseUrl}/comments`, { params: { alertId, paramsSerializer } })
  }
  addAlertComment(params: AddAlertCommentParams): Response<unknown> {
    return axiosInstance().post(`${personaAlertsBaseUrl}/comments`, params)
  }
  deleteAlertComment(commentId: string): Response<unknown> {
    return axiosInstance().post(`${personaAlertsBaseUrl}/comments/${commentId}`)
  }
  getTenantAlertsCountForAlertType(params: GetTenantAlertsCountForAlertTypeParams): Response<StatisticsCountResponse> {
    return axiosInstance().get(`${personaAlertsBaseUrl}/counts`, { params, paramsSerializer })
  }
}

const AlertsApi = new AlertsClass()

export { AlertsApi }
