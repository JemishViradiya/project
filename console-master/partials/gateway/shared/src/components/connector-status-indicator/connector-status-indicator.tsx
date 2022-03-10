//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'

import type { Icon } from '@material-ui/core'
import { Box, Typography } from '@material-ui/core'

import { BasicCircle } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'

import { useConnectorStatus } from '../../hooks/use-connector-status'
import useStyles from './styles'
import type { ConnectorStatusIndicatorProps } from './types'
import { ConnectorStatusLabelType, ConnectorStatusVariant } from './types'

const ConnectorStatusIndicator: React.FC<ConnectorStatusIndicatorProps> = ({
  connector,
  labelType = ConnectorStatusLabelType.Name,
  label,
  boxProps,
  showHealth = false,
  variant = ConnectorStatusVariant.Icon,
}) => {
  const classes = useStyles()
  const health = useConnectorStatus({ connector })
  const getLabel = () => {
    if (label) return label

    return labelType === ConnectorStatusLabelType.Name ? connector?.name : health?.message
  }

  const StatusIcon: typeof Icon = variant === ConnectorStatusVariant.Icon ? health?.Icon : BasicCircle

  return (
    <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-start" {...boxProps}>
      <StatusIcon
        style={{ fontSize: 'medium' }}
        className={health.className}
        aria-label={`${AriaElementLabel.ConnectorWidgetHealthStatus}-${connector?.health?.health.toLowerCase()}`}
      />
      <Box className={classes.wrapper} display="flex" flexDirection="column" alignItems="baseline" ml={2}>
        <Typography>{getLabel()}</Typography>
        {showHealth && (
          <Typography color="textSecondary" variant="caption">
            {health.message}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export { ConnectorStatusIndicator }
