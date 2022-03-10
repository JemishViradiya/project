import type { Response } from '@ues-data/shared-types'

import type { StatisticsCountResponse } from '../types'
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

export default interface AlertInterface {
  /**
   * Get filtered, sorted, paginated alerts list
   * Use `includeMeta` param to add pagination info to the response
   * @param  {GetAlertListParams} params
   */
  getAlertList(params: GetAlertListParams): Response<AlertListResponse>

  /**
   * Get alert details by id
   * @param  {string} alertId
   */
  getAlertDetails(alertId: string): Response<AlertDetails>

  /**
   * Update alerts status
   * @param  {UpdateAlertStatusParams[]} params
   */
  updateAlertStatus(params: UpdateAlertStatusParams[]): Response

  /**
   * Get list of alerts with trust score within specified date-range
   * for specific user device
   * @param  {GetAlertsWithTrustScoreParams} params
   */
  getAlertsWithTrustScore(params: GetAlertsWithTrustScoreParams): Response<PersonaAlertWithTrustScoreItem[]>

  /**
   * Get list of scores by `PersonaScoreType` within specified date-range
   * for specific user device
   * @param  {GetPersonaScoreLogParams} params
   */
  getScoreLog(params: GetPersonaScoreLogParams): Response<PersonaScoreLogItem[]>

  /**
   * Get list of scores for specific alert
   * @param  {string} alertId
   */
  getScoresForAlert(alertId: string): Response<PersonaScoreLogItem[]>

  /**
   * Get alert history and comments list
   * @param  {string} alertId
   */
  getAlertHistoryAndComments(alertId: string): Response<AlertCommentItem[]>

  /**
   * Add alert comment
   * @param  {AddAlertCommentParams} params
   */
  addAlertComment(params: AddAlertCommentParams): Response

  /**
   * Delete alert comment
   * @param  {string} commentId
   */
  deleteAlertComment(commentId: string): Response

  /**
   * Get tenant alert count statistics by alert type
   * @param  {GetTenantAlertsCountForAlertTypeParams} params
   */
  getTenantAlertsCountForAlertType(params: GetTenantAlertsCountForAlertTypeParams): Response<StatisticsCountResponse>
}
