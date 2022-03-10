import reduce from 'lodash/reduce'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VictoryAxis, VictoryGroup, VictoryLine, VictoryScatter } from 'victory'

import Box from '@material-ui/core/Box'
import RootRef from '@material-ui/core/RootRef'

import type {
  GetAlertsWithTrustScoreParams,
  GetPersonaScoreLogParams,
  PersonaAlertWithTrustScoreItem,
  PersonaScoreCollection,
  PersonaScoreLogItem,
} from '@ues-data/persona'
import { PersonaScoreChartInterval } from '@ues-data/persona'
import { theme } from '@ues/assets'

import IECompatibleVictoryChart from './ieCompatibleVictoryChart'
import { MAX_TRUST_SCORE, MIN_TRUST_SCORE } from './userTrustScoreLog.constants'
import type { PersonaAlertScoreScatterItem, UserTrustScoreEnabledModels } from './userTrustScoreLog.types'
import {
  getChartStyles,
  getFromTime,
  getModelStyle,
  getScoreTickFormat,
  getScoreTickValues,
  getTimeTickFormat,
  getTimeTickValues,
  prepareDatum,
} from './userTrustScoreLog.utils'
import UserTrustScoreLogAlertDetailsFlyout from './userTrustScoreLogAlertDetailsFlyout'
import UserTrustScoreLogAlertPoint from './userTrustScoreLogAlertPoint'

const toTime = new Date()
const fromTime = {
  [PersonaScoreChartInterval.Last30Days]: getFromTime(PersonaScoreChartInterval.Last30Days, toTime),
  [PersonaScoreChartInterval.Last24Hours]: getFromTime(PersonaScoreChartInterval.Last24Hours, toTime),
}

interface UserTrustScoreLogChartPropTypes {
  userId: string
  deviceId: string
  interval: PersonaScoreChartInterval
  enabledModels: UserTrustScoreEnabledModels
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
}

const UserTrustScoreLogChart = ({
  userId,
  deviceId,
  interval,
  enabledModels,
  onFetchScoreLogData,
  onFetchAlertsWithTrustScoreData,
  onFetchScoresForSelectedAlert,
  scoreData,
  alertScoreData,
  scoresForAlert,
  defaultSelectedAlertId,
  isScoreDataLoading,
  isScoreForAlertLoading,
}: UserTrustScoreLogChartPropTypes) => {
  const { t } = useTranslation(['persona/common'])
  const styles = getChartStyles()

  const chartRef = useRef<HTMLDivElement>(null)
  const markerBottomTickRef = useRef<SVGAElement>(null)

  // state

  const [lineData, setLineData] = useState<VictoryLine[]>([])
  const [scatterData, setScatterData] = useState<PersonaAlertScoreScatterItem[]>([])
  const [selectedAlert, setSelectedAlert] = useState<PersonaAlertScoreScatterItem>(null)

  // effects

  // create call params for score data for each model when
  // the interval or enabled models change
  useEffect(() => {
    const calls: any = reduce(
      enabledModels,
      (scoreCalls, model) => {
        if (!model.enabled) {
          return scoreCalls
        }

        const params = {
          userId: userId,
          deviceId: deviceId,
          scoreType: model.scoreType,
          fromTime: fromTime[interval].toISOString(),
          toTime: toTime.toISOString(),
        }

        return [...scoreCalls, { params, interval }]
      },
      [],
    )

    onFetchScoreLogData(calls)
  }, [interval, enabledModels, userId, deviceId, onFetchScoreLogData])

  // fetch related alert data when the interval changes
  useEffect(() => {
    const params = {
      userId: userId,
      deviceId: deviceId,
      fromTime: fromTime[interval].toISOString(),
      toTime: toTime.toISOString(),
      sort: 'timestamp',
    }

    onFetchAlertsWithTrustScoreData(params, interval)
  }, [interval, userId, deviceId, onFetchAlertsWithTrustScoreData])

  // update rendered lines when interval, enabled models, or score data changes
  useEffect(() => {
    const newLines = reduce(
      enabledModels,
      (lines, model, key) => {
        if (model.enabled) {
          lines.push(<VictoryLine key={key} data={prepareDatum(scoreData[interval][key])} style={getModelStyle(key)} />)
        }

        return lines
      },
      [],
    )

    setLineData(newLines)
  }, [interval, enabledModels, scoreData])

  // update rendered scatter points when interval or alert data changes
  useEffect(() => {
    const newData = alertScoreData[interval].map(item => ({
      x: new Date(item.timestamp),
      y: item.trustScore,
      severity: item.severity,
      id: item.id,
      eventId: item.eventId,
    }))

    const defaultSelectedAlert = newData.find(alert => alert.id === defaultSelectedAlertId) || newData[newData.length - 1]

    setScatterData(newData)
    setSelectedAlert(defaultSelectedAlert)
  }, [interval, alertScoreData, defaultSelectedAlertId])

  // get scores for the selected alert whenever it changes
  useEffect(() => {
    if (selectedAlert) {
      onFetchScoresForSelectedAlert(selectedAlert.id)
    }
  }, [onFetchScoresForSelectedAlert, selectedAlert])

  // render

  const renderSelectedAlertMarker = () =>
    !!selectedAlert && (
      <VictoryGroup>
        <VictoryScatter
          style={{ data: { fill: theme.light.palette.grey[600] } }}
          data={[
            {
              x: selectedAlert.x,
              y: MAX_TRUST_SCORE + 0.5,
              symbol: 'triangleDown',
              size: 2,
            },
          ]}
        />
        <VictoryLine
          style={{
            data: {
              stroke: theme.light.palette.grey[600],
              strokeWidth: 1,
            },
          }}
          data={[
            { x: selectedAlert.x, y: MAX_TRUST_SCORE },
            { x: selectedAlert.x, y: MIN_TRUST_SCORE - 13 },
          ]}
        />
        <VictoryScatter
          groupComponent={<g ref={markerBottomTickRef} />}
          style={{
            data: { fill: theme.light.palette.grey[600] },
          }}
          data={[
            {
              x: selectedAlert.x,
              y: MIN_TRUST_SCORE - 13.5,
              symbol: 'triangleUp',
              size: 2,
            },
          ]}
        />
      </VictoryGroup>
    )

  const renderAlertDetailsFlyout = () => (
    <UserTrustScoreLogAlertDetailsFlyout
      chartRef={chartRef}
      markerRef={markerBottomTickRef}
      selectedAlert={selectedAlert}
      scores={scoresForAlert}
      isScoreForAlertLoading={isScoreForAlertLoading}
    />
  )

  return (
    <Box position="relative">
      <RootRef rootRef={chartRef}>
        <IECompatibleVictoryChart style={{ parent: styles.parent }} padding={{ top: 20, left: 50, bottom: 50, right: 10 }}>
          <VictoryAxis
            label={t('Time')}
            tickValues={getTimeTickValues(toTime, interval)}
            tickFormat={t => getTimeTickFormat(interval, t)}
            style={styles.axisTime}
            scale="time"
          />
          <VictoryAxis
            dependentAxis
            label={t('Score')}
            domain={[MIN_TRUST_SCORE, MAX_TRUST_SCORE]}
            tickValues={getScoreTickValues()}
            tickFormat={getScoreTickFormat}
            style={styles.axisScore}
          />
          {lineData}
          <VictoryScatter
            dataComponent={
              <UserTrustScoreLogAlertPoint selectedAlertId={selectedAlert && selectedAlert.id} onSelectAlert={setSelectedAlert} />
            }
            data={scatterData}
          />
          {renderSelectedAlertMarker()}
        </IECompatibleVictoryChart>
      </RootRef>
      {!isScoreDataLoading && selectedAlert && renderAlertDetailsFlyout()}
    </Box>
  )
}

export default UserTrustScoreLogChart
