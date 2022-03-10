import React, { memo, useContext, useEffect } from 'react'

import { Link } from '@material-ui/core'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { isMobile } from '@ues-data/platform'
import { Permission, usePermissions } from '@ues-data/shared'

import { EndpointsContext } from '../../providers/endpoints-provider'
import { useStyles } from './styles'

export interface DeviceCellProps {
  row: GatewayAlertsQueryEvent
}

export const DeviceCell: React.FC<DeviceCellProps> = memo(({ row }) => {
  const classNames = useStyles()
  const { endpoints } = useContext(EndpointsContext)

  const displayName = row?.assessment?.datapoint?.source?.deviceModel ?? ''
  const endpointId = row?.assessment?.datapoint?.source?.containerId
  const entitlementId = row?.assessment?.datapoint?.source?.entitlementId
  const osPlatform = row?.assessment?.datapoint?.source?.os ?? ''
  const endpoint = endpoints?.[endpointId ?? '']

  const { hasPermission } = usePermissions()

  return endpoint && endpointId && hasPermission(Permission.ECS_DEVICES_READ) && isMobile(osPlatform, entitlementId) ? (
    <Link
      onClick={e => {
        e.stopPropagation()
        window.location.assign(`/uc/platform#/mobile-devices/${endpointId}`)
      }}
      className={classNames.link}
    >
      {displayName}
    </Link>
  ) : (
    <span>{displayName}</span>
  )
})
