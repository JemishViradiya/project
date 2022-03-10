//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { flatten, isEmpty } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { GanttChart } from '@ues-behaviour/dashboard'
import type { EgressHealthConnectorEvent } from '@ues-data/gateway'
import { EgressHealthConnectorState } from '@ues-data/shared'
import { Config, Data, Hooks } from '@ues-gateway/shared'

import { useDataLayer } from '../hooks'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryEgressHealthConnector } = Data
const { useConnectorsStatusData } = Hooks

export const EgressHealthConnectorWidget: React.FC<ChartProps> = memo(({ globalTime, height }) => {
  const theme = useTheme()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const {
    data: { connectorIds },
  } = useConnectorsStatusData()

  const { data: connectorsHealthData } = useDataLayer({
    query: queryEgressHealthConnector,
    globalTime,
    hasNoData: data => !data?.tenant?.conStates?.length,
    defaultQueryVariables: { connectors: connectorIds },
    skip: isEmpty(connectorIds),
  })

  const prepareConnectorsData = ({ data, color, state }: { data: EgressHealthConnectorEvent; color: string; state: string }) =>
    data.states
      .filter(item => item.state === state)
      .map(item => flatten([data.name, item.state, color, Number(item.startTimeStamp), Number(item.endTimeStamp)]))

  const connectorsData = useMemo(
    () =>
      (connectorsHealthData?.tenant?.conStates ?? []).reduce(
        (acc, entry) => ({
          offline: [
            ...acc.offline,
            ...prepareConnectorsData({ data: entry, color: theme.palette.grey.A200, state: EgressHealthConnectorState.Offline }),
          ],
          online: [
            ...acc.online,
            ...prepareConnectorsData({ data: entry, color: theme.palette.success.main, state: EgressHealthConnectorState.Online }),
          ],
        }),
        { offline: [], online: [] },
      ),
    [connectorsHealthData, theme],
  )

  return (
    <GanttChart
      data={[
        { series: t('common.offline'), data: connectorsData.offline },
        { series: t('common.online'), data: connectorsData.online },
      ]}
      height={height}
      showLegend
      showZoom
    />
  )
})
