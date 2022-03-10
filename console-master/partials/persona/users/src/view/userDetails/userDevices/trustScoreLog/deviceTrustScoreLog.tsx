import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { DEFAULT_PERSONA_SCORE_DATA, DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA } from '@ues-data/persona'
import { UserTrustScoreLog } from '@ues-persona/shared'

import { useQueryScoresForSelectedAlert } from './useQueryScoresForSelectedAlert'
import { useQueryUserAlertWithTrustScore } from './useQueryUserAlertsWithTrustScore'
import { useQueryUserPersonaScoreLog } from './useQueryUserPersonaScoreLog'

interface DeviceTrustScoreLogProps {
  userId: string
  deviceId: string
}

export const DeviceTrustScoreLog: React.FC<DeviceTrustScoreLogProps> = React.memo(
  ({ userId, deviceId }: DeviceTrustScoreLogProps) => {
    const { t } = useTranslation(['persona/common'])

    const { data: scoreLogData, loading: scoreDataLoading, getUserPersonaScoreLog } = useQueryUserPersonaScoreLog(deviceId)

    const {
      data: alertWithTrustScoreData,
      loading: alertWithTrustScoreLoading,
      getUserAlertsWithTrustScore,
    } = useQueryUserAlertWithTrustScore(deviceId)

    const {
      data: scoresForSelectedAlertData,
      loading: scoresForAlertLoading,
      getScoresForSelectedAlert,
    } = useQueryScoresForSelectedAlert(deviceId)

    const alertScoreFailed = false

    return (
      <Box pl={6} pt={4}>
        <Box mb={6}>
          <Typography variant="h2">{t('users.sectionTitles.userTrustScoreLog')}</Typography>
        </Box>

        <UserTrustScoreLog
          userId={userId}
          deviceId={deviceId}
          onFetchScoreLogData={getUserPersonaScoreLog}
          onFetchAlertsWithTrustScoreData={getUserAlertsWithTrustScore}
          onFetchScoresForSelectedAlert={getScoresForSelectedAlert}
          scoreData={scoreLogData || DEFAULT_PERSONA_SCORE_DATA}
          alertScoreData={alertWithTrustScoreData || DEFAULT_USER_ALERTS_WITH_TRUST_SCORE_DATA}
          scoresForAlert={scoresForSelectedAlertData}
          isScoreDataLoading={scoreDataLoading || alertWithTrustScoreLoading}
          isScoreForAlertLoading={scoresForAlertLoading}
          alertScoreFailed={alertScoreFailed}
        />
      </Box>
    )
  },
)
