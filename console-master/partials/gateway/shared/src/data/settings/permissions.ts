import { Permission } from '@ues-data/shared-types'

export const TenantReadPermissions = new Set([Permission.BIG_TENANT_READ])
export const TenantCreatePermissions = new Set([Permission.BIG_TENANT_CREATE])
export const TenantUpdatePermissions = new Set([Permission.BIG_TENANT_UPDATE])
export const TenantDeletePermissions = new Set([Permission.BIG_TENANT_DELETE])

export const NetworkServicesReadPermissions = new Set([Permission.BIG_NETWORKSERVICES_READ])
export const NetworkServicesCreatePermissions = new Set([Permission.BIG_NETWORKSERVICES_CREATE])
export const NetworkServicesUpdatePermissions = new Set([Permission.BIG_NETWORKSERVICES_UPDATE])
export const NetworkServicesDeletePermissions = new Set([Permission.BIG_NETWORKSERVICES_DELETE])

export const AclReadPermissions = new Set([Permission.BIG_ACL_READ])
export const AclUpdatePermissions = new Set([Permission.BIG_ACL_UPDATE])

export const ReportingReadPermissions = new Set([Permission.BIG_REPORTING_READ])
