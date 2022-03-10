import { Permission, usePermissions } from '@ues-data/shared'

export const usePoliciesPermissions = () => {
  const { hasPermission } = usePermissions()
  const policyReadPermission = hasPermission(Permission.BIP_POLICY_READ)
  const policyUpdatePermission = hasPermission(Permission.BIP_POLICY_UPDATE)
  const policyDeletePermission = hasPermission(Permission.BIP_POLICY_DELETE)
  const policyCreatePermission = hasPermission(Permission.BIP_POLICY_CREATE)

  return {
    canRead: policyReadPermission,
    canUpdate: policyUpdatePermission,
    canDelete: policyDeletePermission,
    canCreate: policyCreatePermission,
  }
}
