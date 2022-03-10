import React from 'react'

import { Link } from '@material-ui/core'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { Permission, usePermissions } from '@ues-data/shared'

import { useStyles } from './styles'

export interface UserCellProps {
  row: GatewayAlertsQueryEvent
}

export const UserCell: React.FC<UserCellProps> = ({ row }) => {
  const classNames = useStyles()

  const displayName = row.assessment?.userInfo?.displayName ?? ''
  const userId = row.assessment?.eEcoId

  const { hasPermission } = usePermissions()

  return userId && hasPermission(Permission.ECS_USERS_READ) ? (
    <Link
      onClick={e => {
        e.stopPropagation()
        window.location.assign(`/uc/platform#/users/${encodeURIComponent(btoa(userId))}/events/network-events`)
      }}
      className={classNames.link}
    >
      {displayName}
    </Link>
  ) : (
    <span>{displayName}</span>
  )
}
