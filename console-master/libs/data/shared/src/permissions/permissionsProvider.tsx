import React, { useMemo } from 'react'

import { useUesSession } from '../console'
import { FeatureName, useFeatures } from '../featurization'
import { useOverrideChange } from '../shared/useOverrideChange'
import type { Permission, VenueRbac, VenueRoles, VenueScopes } from './types'
import type { UsePermissionFunctions } from './use-permissions'
import { PermissionsContext } from './use-permissions'

export const PERMISSION_OVERRIDES_STORAGE_KEY = 'UES_permissionOverrides'

const emptyOverrides: Partial<Record<Permission, boolean>> = {}

export const PermissionsApi = (
  permissions: Set<Permission>,
  overrides: Partial<Record<Permission, boolean>> = {},
  { role, scp }: Partial<VenueRbac> = {},
): UsePermissionFunctions => {
  const resolvedPermissions = applyOverrides(permissions, overrides)
  const hasPermission = ((...namedPermissions: Permission[] | [Set<Permission>]) => {
    for (const required of asIterable<Permission>(namedPermissions)) {
      if (!resolvedPermissions.has(required)) return false
    }
    return true
  }) as UsePermissionFunctions['hasPermission']
  const hasAnyPermission = ((...namedPermissions: Permission[] | [Set<Permission>]) => {
    for (const required of asIterable<Permission>(namedPermissions)) {
      if (resolvedPermissions.has(required)) return true
    }
    return false
  }) as UsePermissionFunctions['hasAnyPermission']

  const hasVenueAnyRole = ((...roles: VenueRoles[] | [Set<VenueRoles>]) =>
    Array.from(asIterable<VenueRoles>(roles)).some(
      roleName => !role.isCustom && role.name === roleName,
    )) as UsePermissionFunctions['hasVenueAnyRole']
  const hasVenuePermission = (name: string, value = 'All') => role.isCustom && name in role.rbac && role.rbac[name] === value
  const hasVenueScope = (name: VenueScopes) => scp.some(scope => scope === name)

  return {
    resolvedPermissions,
    hasPermission,
    hasAnyPermission,
    hasVenueAnyRole,
    hasVenuePermission,
    hasVenueScope,
  }
}

export const PermissionsProvider = ({ children }) => {
  const { permissions, venueRbac } = useUesSession()
  const features = useFeatures()
  const permissionOverridesRecord = useOverrideChange<Partial<Record<Permission, boolean>>>(
    PERMISSION_OVERRIDES_STORAGE_KEY,
    emptyOverrides,
  )[0]

  const featureProps = useMemo(() => {
    // if feature not enabled, then return true
    if (!features.isEnabled(FeatureName.PermissionChecksEnabled)) {
      return PermissionsContext.disabledValue
    }

    return PermissionsApi(permissions, permissionOverridesRecord, venueRbac)
  }, [features, permissions, permissionOverridesRecord, venueRbac])

  return <PermissionsContext.Provider value={featureProps}>{children}</PermissionsContext.Provider>
}

function applyOverrides(set: Set<Permission>, overrides: Partial<Record<Permission, boolean>>) {
  const _union = new Set<Permission>(set)
  for (const elem of Object.keys(overrides)) {
    if (overrides[elem] === true) _union.add(elem as Permission)
    else _union.delete(elem as Permission)
  }
  return _union
}

function asIterable<T>(items: T[] | [Set<T>]) {
  const first = items[0]
  if (first && first instanceof Set) return first.values()
  return (items as T[]).values()
}
