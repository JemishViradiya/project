/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo } from 'react'
import { useLocation } from 'react-router'

import { BigPermissions, usePermissions, useServiceEnabled } from '@ues-data/shared'
import type { Permission } from '@ues-data/shared-types'
import { PermissionError, ServiceEnabledError, ServiceId } from '@ues-data/shared-types'

import { SecuredContentFallback } from '../Access/SecuredContentFallback'
import { ServiceEnabledContentFallback } from '../Access/ServiceEnabledContentFallback'
import { GenericErrorBoundary } from '../GenericErrorBoundary'
import { useErrorBoundaryRecovery } from '../useErrorBoundaryRecovery'

export const SecuredErrorHandler = ({ error }: { error?: Error }): JSX.Element => {
  if (error instanceof PermissionError) return <SecuredContentFallback permissions={error.requiredPermissions} />
  else if (error instanceof ServiceEnabledError) return <ServiceEnabledContentFallback serviceId={error.service} />
  else throw error // Rethrow to top level handler
}

interface Fn<T = void> {
  (...args: Permission[]): T
  (arg: Set<Permission> | Permission): T
}

const hasBigPermission = (...permissions: Permission[] | [Set<Permission>]) => {
  for (const permission of asIterable(permissions)) {
    if (BigPermissions.has(permission)) return true
  }
  return false
}

const useSecuredContent: Fn = (...permissions) => {
  const { hasPermission } = usePermissions()
  const { isEnabled } = useServiceEnabled()

  if (hasBigPermission(...permissions) && !isEnabled(ServiceId.BIG)) {
    throw new ServiceEnabledError(ServiceId.BIG)
  }

  if (!hasPermission(...permissions)) {
    throw new PermissionError(permissions)
  }
}

const useAnySecuredContent: Fn<Set<Permission>> = (...permissions) => {
  const { hasAnyPermission, resolvedPermissions } = usePermissions()
  if (!hasAnyPermission(...permissions)) {
    throw new PermissionError(permissions)
  }
  return resolvedPermissions
}

const useSecuredContentWithService = ({
  requiredPermissions = new Set(),
  requiredServices,
}: {
  requiredPermissions?: Set<Permission> | Permission
  requiredServices?: Set<ServiceId> | ServiceId
}) => {
  const { isEnabled } = useServiceEnabled()
  if (requiredServices) {
    const servicesSet = requiredServices instanceof Set ? requiredServices : new Set([requiredServices])
    for (const service of servicesSet) {
      if (!isEnabled(service)) {
        throw new ServiceEnabledError(service)
      }
    }
  }
  useSecuredContent(requiredPermissions)
}

const SecuredContent: React.FC<{
  requiredPermissions?: Set<Permission> | Permission
  requiredServices?: Set<ServiceId> | ServiceId
}> = ({ children, ...rest }) => {
  useSecuredContentWithService(rest)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

const SecuredContentBoundary: React.FC = memo(({ children }) => {
  const { resolvedPermissions } = usePermissions()
  const location = useLocation()
  const key = useErrorBoundaryRecovery(resolvedPermissions)
  return (
    <GenericErrorBoundary key={`${location.key}.${key}`} fallback={<SecuredErrorHandler />}>
      {children}
    </GenericErrorBoundary>
  )
})

function asIterable(items: Permission[] | [Set<Permission>]) {
  const first = items[0]
  if (first && first instanceof Set) return first.values()
  return (items as Permission[]).values()
}

export { SecuredContentBoundary, SecuredContent, useSecuredContent, useAnySecuredContent, useSecuredContentWithService }
