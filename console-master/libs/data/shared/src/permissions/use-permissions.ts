import { createContext, useContext } from 'react'

import type { VenueRoles, VenueScopes } from './types'
import { Permission } from './types'

export interface UsePermissionFunctions {
  resolvedPermissions: Set<Permission>
  hasPermission(permissions: Permission | Set<Permission>): boolean
  hasPermission(...permissions: Permission[] | [Set<Permission>]): boolean
  hasAnyPermission(permissions: Permission | Set<Permission>): boolean
  hasAnyPermission(...permissions: Permission[] | [Set<Permission>]): boolean
  hasVenueAnyRole(roles: VenueRoles | Set<VenueRoles>): boolean
  hasVenueAnyRole(...roles: VenueRoles[] | [Set<VenueRoles>]): boolean
  hasVenuePermission(permission: string): boolean
  hasVenueScope(scope: VenueScopes): boolean
}

const nullValue: UsePermissionFunctions = {
  resolvedPermissions: new Set(),
  hasPermission: (..._permissions) => false,
  hasAnyPermission: (..._permissions) => false,
  hasVenueAnyRole: (..._roles) => false,
  hasVenuePermission: _permission => false,
  hasVenueScope: _scope => false,
}
const disabledValue: UsePermissionFunctions = {
  resolvedPermissions: new Set(Object.values(Permission)),
  hasPermission: (..._permissions) => true,
  hasAnyPermission: (..._permissions) => true,
  hasVenueAnyRole: (..._roles) => true,
  hasVenuePermission: _permission => true,
  hasVenueScope: _scope => true,
}
export const PermissionsContext: React.Context<UsePermissionFunctions> & {
  disabledValue: UsePermissionFunctions
} = Object.assign(createContext<UsePermissionFunctions>(nullValue), { disabledValue })

export const usePermissions = (): UsePermissionFunctions => {
  return useContext(PermissionsContext)
}
