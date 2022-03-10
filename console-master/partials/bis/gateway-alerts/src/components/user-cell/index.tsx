import React from 'react'
import { Link } from 'react-router-dom'

import { Link as LinkMU } from '@material-ui/core'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { FeatureName, Permission, useFeatures, usePermissions } from '@ues-data/shared'

import type { UserHrefFn } from '../../types'
import { useStyles } from './styles'

export interface UserCellProps {
  row: GatewayAlertsQueryEvent
  userHrefFn?: UserHrefFn
}

export const UserCell: React.FC<UserCellProps> = ({ row, userHrefFn }) => {
  const classNames = useStyles()

  const displayName = row.assessment?.userInfo?.displayName ?? ''
  const userId = row.assessment?.eEcoId
  const { isEnabled } = useFeatures()
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)
  const singleNxApp = isEnabled(FeatureName.SingleNXApp)

  const { hasPermission } = usePermissions()

  const oneAppLink = (
    <Link to={userHrefFn(userId)} className={classNames.link}>
      {displayName}
    </Link>
  )

  const LinkElement = gatewayAlertsTransition ? (
    singleNxApp ? (
      oneAppLink
    ) : (
      <LinkMU
        onClick={e => {
          e.stopPropagation()
          window.location.assign(`/uc/platform#${userHrefFn(userId)}`)
        }}
        className={classNames.link}
      >
        {displayName}
      </LinkMU>
    )
  ) : (
    oneAppLink
  )

  return userHrefFn && userId && hasPermission(Permission.ECS_USERS_READ) ? LinkElement : <span>{displayName}</span>
}
