//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { flatten } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { getDateRangeTimestampString } from '@ues-behaviour/dashboard'
import { XGrid } from '@ues-behaviour/x-grid'
import { ConnectorHealth, EgressHealthConnectorState } from '@ues-data/gateway'
import { useStatefulApolloQuery, useUesSession } from '@ues-data/shared'
import { Components, Config, Data, Utils } from '@ues-gateway/shared'
import type { TableColumn } from '@ues/behaviours'
import { ContentAreaPanel, TableProvider } from '@ues/behaviours'

import { CONNECTOR_ERROR_KEYS } from '../constants'
import { TimeIntervalId } from '../types'
import useStyles from './styles'
import TimeRangeSelect from './time-range-select'

const { ConnectorStatusIndicator, ConnectorStatusVariant } = Components
const { queryEgressHealthConnector } = Data
const { formatTimestamp } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config

interface ConnectionHistoryProps {
  connectorId: string
}

const ConnectionHistory: React.FC<ConnectionHistoryProps> = ({ connectorId }) => {
  const classes = useStyles()
  const { tenantId } = useUesSession()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const defaultTimeIntervalId = TimeIntervalId.Last7Days
  const defaultTimeInterval = getDateRangeTimestampString({ timeInterval: defaultTimeIntervalId, nowTime: new Date() })

  const [timeInterval, setTimeInterval] = useState(defaultTimeInterval)

  const { data, loading } = useStatefulApolloQuery(queryEgressHealthConnector, {
    variables: {
      tenantId: tenantId,
      fromDate: timeInterval.startDate,
      toDate: timeInterval.endDate,
      connectors: [connectorId],
    },
    skip: !connectorId,
  })

  const tableData = useMemo(
    () =>
      flatten(
        (data?.tenant?.conStates ?? []).map(entry =>
          flatten(
            entry.states.map((item, index) => ({
              id: `${entry.id}.${index}`,
              state: item.state,
              startTimeStamp: item.startTimeStamp,
              errType: item.errType,
            })),
          ),
        ),
      ),
    [data],
  )

  const renderHealthStatus = ({ state }) => (
    <ConnectorStatusIndicator
      connector={{
        health: { health: state === EgressHealthConnectorState.Offline ? ConnectorHealth.Red : ConnectorHealth.Green },
      }}
      label={state}
      variant={ConnectorStatusVariant.Circle}
    />
  )

  const columns: TableColumn[] = [
    {
      label: t('common.labelTime'),
      dataKey: 'timeStamp',
      renderCell: ({ startTimeStamp }) => formatTimestamp(startTimeStamp),
      gridColDefProps: { flex: 1 },
    },
    {
      label: t('common.labelStatus'),
      dataKey: 'state',
      renderCell: renderHealthStatus,
      gridColDefProps: { flex: 1 },
    },
    {
      label: t('common.comments'),
      dataKey: 'comment',
      renderCell: ({ errType }) => errType && t(CONNECTOR_ERROR_KEYS[errType]),
      gridColDefProps: { flex: 1.5 },
    },
  ]

  const basicProps = {
    columns,
    loading,
  }

  const tableProps = {
    getRowId: rowData => rowData.id,
    loading: loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    rows: tableData,
    checkboxSelection: false,
    // Workaround for the problem with the horizontal scrollbar showing when vertical scrollbar appears
    // Read more: https://github.com/mui/mui-x/issues/660
    scrollbarSize: 17,
  }

  return (
    <ContentAreaPanel title={t('connectors.connectionHistory')}>
      <Box className={classes.selectWrapper}>
        <TimeRangeSelect initialValue={defaultTimeIntervalId} onChange={value => setTimeInterval(value)} />
      </Box>
      <Box className={classes.container}>
        <TableProvider basicProps={basicProps}>
          <XGrid dense {...tableProps} />
        </TableProvider>
      </Box>
    </ContentAreaPanel>
  )
}

export default ConnectionHistory
