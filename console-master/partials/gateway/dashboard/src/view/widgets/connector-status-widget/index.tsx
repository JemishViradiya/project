//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Divider, Typography, useTheme } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { Components, Config, Hooks } from '@ues-gateway/shared'

import useStyles from './styles'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { useConnectorStatus, useConnectorsStatusData, useBackendState } = Hooks
const { ConnectorStatusIndicator, ConnectorStatusVariant, WidgetList } = Components

export const ConnectorStatusWidget: React.FC<ChartProps> = memo(({ height }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()
  const theme = useTheme()
  const {
    data: { enrolledConnectors, health },
    error,
    loading,
  } = useConnectorsStatusData()

  useBackendState(error, enrolledConnectors?.length === 0)

  const { className, message } = useConnectorStatus({ health })

  const chartHeight = height - theme.spacing(27)

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography component="p" variant="h1" className={className}>
          {message}
        </Typography>
        <Typography variant="caption" color="textSecondary" className={classes.statusText}>
          {t('dashboard.currentStatus')}
        </Typography>
      </Box>
      <Divider className={classes.divider} />
      <WidgetList
        data={enrolledConnectors}
        loading={loading}
        renderItem={connector => (
          <ConnectorStatusIndicator connector={connector} showHealth variant={ConnectorStatusVariant.Circle} />
        )}
        height={chartHeight}
      />
    </>
  )
})
