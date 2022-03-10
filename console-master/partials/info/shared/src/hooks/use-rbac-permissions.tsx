import { Permission, usePermissions } from '@ues-data/shared'

export const useRbacPermissions = () => {
  const { hasPermission } = usePermissions()
  const readDevicePermission = hasPermission(Permission.BIP_DEVICE_READ)
  const readUsersPermission = hasPermission(Permission.ECS_USERS_READ)
  const readPolicyPermission = hasPermission(Permission.BIP_POLICY_READ)
  const readPolicyListPermission = hasPermission(Permission.BIP_POLICY_LIST)
  const readFileSummaryPermission = hasPermission(Permission.BIP_FILESUMMARY_READ)
  const readFileContentPermission = hasPermission(Permission.BIP_FILECONTENT_READ)
  const readSettingsPermission = hasPermission(Permission.BIP_SETTINGS_READ)

  return {
    canReadDevice: readDevicePermission,
    canReadUsers: readUsersPermission,
    canReadPolicy: readPolicyPermission,
    canReadPolicyList: readPolicyListPermission,
    canReadFileSummary: readFileSummaryPermission,
    canReadFileContent: readFileContentPermission,
    canReadSettings: readSettingsPermission,
  }
}
