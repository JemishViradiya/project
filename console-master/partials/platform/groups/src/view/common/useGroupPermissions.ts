import { Permission, usePermissions } from '@ues-data/shared'

interface Permissions {
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

export const useGroupPermissions = (): Permissions => {
  const { hasPermission } = usePermissions()

  return {
    canCreate: hasPermission(Permission.ECS_USERS_CREATE),
    canUpdate: hasPermission(Permission.ECS_USERS_UPDATE),
    canDelete: hasPermission(Permission.ECS_USERS_DELETE),
  }
}
