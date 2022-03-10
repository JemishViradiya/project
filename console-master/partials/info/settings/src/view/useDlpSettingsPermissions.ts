import { Permission, usePermissions } from '@ues-data/shared'

export const useDlpSettingsPermissions = () => {
  const { hasPermission } = usePermissions()
  const canRead = hasPermission(Permission.BIP_SETTINGS_READ)
  const canUpdate = hasPermission(Permission.BIP_SETTINGS_UPDATE)

  return { canRead, canUpdate }
}
