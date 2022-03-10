//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box, Tooltip } from '@material-ui/core'

import type { AclRuleDisposition } from '@ues-data/gateway'
import { AclRuleDispositionAction } from '@ues-data/gateway'
import { BasicNotification, BasicVisibilityOff, StatusProtect } from '@ues/assets'

import type { CommonCellProps } from '../../../types'

interface ActionsIconCellProps extends CommonCellProps {
  property: keyof AclRuleDisposition
  show?: boolean
  tooltipLabel?: string
}

export const ActionsIconCell: React.FC<ActionsIconCellProps> = ({ tooltipLabel, property, show = false, item }) => {
  const shouldShowIcon = (expectedAction: AclRuleDispositionAction) =>
    (item?.disposition?.action === expectedAction && item?.disposition?.[property]) || show

  const iconComponents: Partial<Record<keyof AclRuleDisposition, JSX.Element>> = {
    applyBlockGatewayList: shouldShowIcon(AclRuleDispositionAction.Allow) && <StatusProtect fontSize="small" />,
    notify: shouldShowIcon(AclRuleDispositionAction.Block) && <BasicNotification fontSize="small" />,
    privacy: <BasicVisibilityOff fontSize="small" />,
  }

  const icon = iconComponents[property]

  return tooltipLabel && icon ? (
    <Tooltip title={tooltipLabel}>
      <Box display="flex" justifyContent="center" width="100%">
        {icon}
      </Box>
    </Tooltip>
  ) : (
    icon
  )
}
