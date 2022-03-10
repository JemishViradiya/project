/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import cond from 'lodash/cond'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import type {
  GetAlertsWithTrustScoreParams,
  GetPersonaScoreLogParams,
  PersonaAlertWithTrustScoreItem,
  PersonaScoreCollection,
  PersonaScoreLogItem,
  PersonaScoreType,
} from '@ues-data/persona'
import { PersonaScoreChartInterval } from '@ues-data/persona'
import { theme } from '@ues/assets'

import { USER_TRUST_SCORE_LOG_MODELS } from './userTrustScoreLog.constants'
import type { UserTrustScoreEnabledModels } from './userTrustScoreLog.types'
import UserTrustScoreLogChart from './userTrustScoreLogChart'
import UserTrustScoreLogHeader from './userTrustScoreLogHeader'

interface UserTrustScoreLogPropTypes {
  userId: string
  deviceId: string
  onFetchScoreLogData: (
    calls: {
      params: GetPersonaScoreLogParams
      interval: PersonaScoreChartInterval
    }[],
  ) => void
  onFetchAlertsWithTrustScoreData: (params: GetAlertsWithTrustScoreParams, interval: PersonaScoreChartInterval) => void
  onFetchScoresForSelectedAlert: (alertId: string) => void
  scoreData: Record<PersonaScoreChartInterval, PersonaScoreCollection>
  alertScoreData: Record<PersonaScoreChartInterval, PersonaAlertWithTrustScoreItem[]>
  scoresForAlert: PersonaScoreLogItem[]
  defaultSelectedAlertId?: string
  isScoreDataLoading: boolean
  isScoreForAlertLoading: boolean
  alertScoreFailed: boolean
}

const UserTrustScoreLog = ({
  userId,
  deviceId,
  onFetchScoreLogData,
  onFetchAlertsWithTrustScoreData,
  onFetchScoresForSelectedAlert,
  scoreData,
  alertScoreData,
  scoresForAlert,
  defaultSelectedAlertId,
  isScoreDataLoading,
  isScoreForAlertLoading,
  alertScoreFailed,
}: UserTrustScoreLogPropTypes) => {
  const { t } = useTranslation(['persona/common'])
  // state
  const [interval, setInterval] = useState(PersonaScoreChartInterval.Last24Hours)
  const [enabledModels, setEnabledModels] = useState<UserTrustScoreEnabledModels>(USER_TRUST_SCORE_LOG_MODELS)

  // actions

  const onChangeModel = (model: PersonaScoreType) => (_event: React.MouseEvent) => {
    const newModels = {
      ...enabledModels,
      [model]: {
        ...enabledModels[model],
        enabled: !enabledModels[model].enabled,
      },
    }

    setEnabledModels(newModels)
  }

  const onChangeInterval = (_event: React.MouseEvent, newInterval: PersonaScoreChartInterval) =>
    cond([[() => !!newInterval, () => setInterval(newInterval)]])(undefined)

  // render
  const renderLoader = () => (
    <Box
      position="absolute"
      top={0}
      left={0}
      p={6}
      borderRadius={2}
      bgcolor={theme.light.palette.background.paper}
      width="100%"
      height="100%"
      flexDirection="column"
      display="flex"
      alignItems="center"
      justifyContent="start"
    >
      <CircularProgress color="secondary" />
      <Box pt={4}>
        <Typography variant="body2" color="textSecondary">
          {t('loading')}
        </Typography>
      </Box>
    </Box>
  )
  return (
    <Box position="relative" height="100%">
      <Box mb={6}>
        <UserTrustScoreLogHeader
          enabledModels={enabledModels}
          interval={interval}
          disabled={isScoreDataLoading}
          onChangeModel={onChangeModel}
          onChangeInterval={onChangeInterval}
        />
      </Box>
      <UserTrustScoreLogChart
        userId={userId}
        deviceId={deviceId}
        enabledModels={enabledModels}
        interval={interval}
        onFetchScoreLogData={onFetchScoreLogData}
        onFetchAlertsWithTrustScoreData={onFetchAlertsWithTrustScoreData}
        onFetchScoresForSelectedAlert={onFetchScoresForSelectedAlert}
        scoreData={scoreData}
        alertScoreData={alertScoreData}
        scoresForAlert={scoresForAlert}
        defaultSelectedAlertId={defaultSelectedAlertId}
        isScoreDataLoading={isScoreDataLoading}
        isScoreForAlertLoading={isScoreForAlertLoading}
      />
      {alertScoreFailed && (
        <Grid container justify="center" direction="row">
          <Grid item>
            <Typography variant="body2">{t('scoreDataUnavailableError')}</Typography>
          </Grid>
        </Grid>
      )}
      {isScoreDataLoading && renderLoader()}
    </Box>
  )
}

export default React.memo(UserTrustScoreLog)
