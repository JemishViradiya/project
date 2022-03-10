import { Permission, usePermissions } from '@ues-data/shared'

export const useEventsPermissions = () => {
  const { hasPermission } = usePermissions()
  const readPermission = hasPermission(Permission.BIP_EVENT_READ)
  const readDevicePermission = hasPermission(Permission.BIP_DEVICE_READ)
  const readUsersPermission = hasPermission(Permission.ECS_USERS_READ)
  const readPolicyPermission = hasPermission(Permission.BIP_POLICY_READ)
  const readFileSummaryPermission = hasPermission(Permission.BIP_FILESUMMARY_READ)
  const readFileContentPermission = hasPermission(Permission.BIP_FILECONTENT_READ)
  const readSettingsPermission = hasPermission(Permission.BIP_SETTINGS_READ)

  return {
    canReadEventList: readPermission,
    canReadDevice: readDevicePermission,
    canReadUsers: readUsersPermission,
    canReadPolicy: readPolicyPermission,
    canReadFileSummary: readFileSummaryPermission,
    canReadFileContent: readFileContentPermission,
    canReadSettings: readSettingsPermission,
  }
}
