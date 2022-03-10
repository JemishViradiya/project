import { useMemo } from 'react'

import { usePermissions } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import { useSecuredContent } from '@ues/behaviours'

export enum BigService {
  Acl = 'big-acl',
  GatewayAppPolicy = 'big-gatewayapp-profile',
  NetworkAccessControlPolicy = 'big-network-access-control',
  NetworkServices = 'big-network-services',
  Reporting = 'big-reporting',
  Tenant = 'big-tenant',
}

interface BigPermissions {
  canRead: boolean
  canDelete: boolean
  canCreate: boolean
  canUpdate: boolean
}

export const BIG_SERVICES_PERMISSIONS_DICTIONARY: Record<BigService, Partial<Record<keyof BigPermissions, Permission>>> = {
  [BigService.Acl]: {
    canRead: Permission.BIG_ACL_READ,
    canCreate: Permission.BIG_ACL_UPDATE,
    canDelete: Permission.BIG_ACL_UPDATE,
    canUpdate: Permission.BIG_ACL_UPDATE,
  },

  [BigService.GatewayAppPolicy]: {
    canRead: Permission.BIG_GATEWAYAPPPROFILE_READ,
    canDelete: Permission.BIG_GATEWAYAPPPROFILE_DELETE,
    canCreate: Permission.BIG_GATEWAYAPPPROFILE_CREATE,
    canUpdate: Permission.BIG_GATEWAYAPPPROFILE_UPDATE,
  },

  [BigService.NetworkAccessControlPolicy]: {
    canRead: Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ,
    canDelete: Permission.BIG_NETWORKACCESSCONTROLPROFILE_DELETE,
    canCreate: Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE,
    canUpdate: Permission.BIG_NETWORKACCESSCONTROLPROFILE_UPDATE,
  },

  [BigService.NetworkServices]: {
    canRead: Permission.BIG_NETWORKSERVICES_READ,
    canDelete: Permission.BIG_NETWORKSERVICES_DELETE,
    canCreate: Permission.BIG_NETWORKSERVICES_CREATE,
    canUpdate: Permission.BIG_NETWORKSERVICES_UPDATE,
  },

  [BigService.Reporting]: {
    canRead: Permission.BIG_REPORTING_READ,
  },

  [BigService.Tenant]: {
    canRead: Permission.BIG_TENANT_READ,
    canDelete: Permission.BIG_TENANT_DELETE,
    canCreate: Permission.BIG_TENANT_CREATE,
    canUpdate: Permission.BIG_TENANT_UPDATE,
  },
}

type UseBigPermissionsFn = (service: BigService, requirePermissionTo?: keyof BigPermissions) => Partial<BigPermissions>

export const useBigPermissions: UseBigPermissionsFn = (service, requirePermissionTo = 'canRead') => {
  const permissionsDictionary = BIG_SERVICES_PERMISSIONS_DICTIONARY[service]

  useSecuredContent(permissionsDictionary?.[requirePermissionTo])

  const { hasPermission } = usePermissions()

  return useMemo(
    () =>
      Object.entries(permissionsDictionary ?? {}).reduce(
        (acc, [access, permission]) => ({
          ...acc,
          [access]: permission ? hasPermission(permission) : false,
        }),
        {},
      ),
    [permissionsDictionary, hasPermission],
  )
}
