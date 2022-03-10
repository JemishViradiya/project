import { Permission, usePermissions } from '@ues-data/shared'

export const useDirectoryPermissions = () => {
  const { hasPermission } = usePermissions()
  const canRead = hasPermission(Permission.ECS_DIRECTORY_READ)
  const canUpdate = hasPermission(Permission.ECS_DIRECTORY_UPDATE)
  const canDelete = hasPermission(Permission.ECS_DIRECTORY_DELETE)
  const canCreate = hasPermission(Permission.ECS_DIRECTORY_CREATE)

  return { canRead: canRead, canUpdate: canUpdate, canDelete: canDelete, canCreate: canCreate }
}
