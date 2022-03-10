//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { BoxProps } from '@material-ui/core'

import type { ConnectorConfigInfo } from '@ues-data/gateway'

export enum ConnectorStatusVariant {
  Circle = 'circle',
  Icon = 'icon',
}

export enum ConnectorStatusLabelType {
  Name = 'name',
  Status = 'status',
}

export interface ConnectorStatusIndicatorProps {
  boxProps?: BoxProps
  connector: Partial<ConnectorConfigInfo>
  labelType?: ConnectorStatusLabelType
  label?: string
  showHealth?: boolean
  variant?: ConnectorStatusVariant
}
