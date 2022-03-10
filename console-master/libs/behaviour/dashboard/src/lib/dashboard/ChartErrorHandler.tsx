/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react'

import { Box } from '@material-ui/core'

import type { Permission } from '@ues-data/shared'
import { usePermissions } from '@ues-data/shared'

import { GenericErrorFallback, NoDataFallback, PermissionDeniedFallback } from './card/DashboardCardFallback'

type ChartErrorHandlerProps = {
  requiredPermissions?: Permission[]
  noData?: boolean
  errorMessage?: string
  fallbackStyles?: any
}

export const ChartErrorHandler: React.FC<ChartErrorHandlerProps> = ({
  children,
  requiredPermissions,
  noData,
  errorMessage,
  fallbackStyles,
}): JSX.Element => {
  const { hasPermission } = usePermissions()

  let fallback = undefined
  if (requiredPermissions && !hasPermission(...requiredPermissions))
    fallback = <PermissionDeniedFallback permissions={requiredPermissions} />
  else if (noData) fallback = <NoDataFallback />
  else if (errorMessage) fallback = <GenericErrorFallback errorMessage={errorMessage} />

  if (fallback) return <Box {...fallbackStyles}>{fallback}</Box>
  else return <>{children}</>
}
