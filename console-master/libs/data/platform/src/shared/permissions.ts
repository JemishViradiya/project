import { Permission, ReconciliationEntityType } from '@ues-data/shared-types'

export enum Action {
  READ = 'Read',
  UPDATE = 'Update',
  CREATE = 'Create',
  DELETE = 'Delete',
}

export const UserReadPermissions = new Set([Permission.ECS_USERS_READ])
export const UserUpdatePermissions = new Set([Permission.ECS_USERS_UPDATE])
export const UserCreatePermissions = new Set([Permission.ECS_USERS_CREATE])
export const UserDeletePermissions = new Set([Permission.ECS_USERS_DELETE])

export const DeviceReadPermissions = new Set([Permission.ECS_DEVICES_READ])
export const DeviceDeletePermissions = new Set([Permission.ECS_DEVICES_DELETE])

export const ActivationSettingsUpdatePermissions = new Set([Permission.ECS_ACTIVATIONSETTINGS_UPDATE])
export const ActivationSettingsReadPermissions = new Set([Permission.ECS_ACTIVATIONSETTINGS_READ])

export const BCNReadPermissions = new Set([Permission.ECS_BCN_READ])
export const BCNCreatePermissions = new Set([Permission.ECS_BCN_CREATE])
export const BCNUpdatePermissions = new Set([Permission.ECS_BCN_UPDATE])
export const BCNDeletePermissions = new Set([Permission.ECS_BCN_DELETE])

export const DirectoryReadPermissions = new Set([Permission.ECS_DIRECTORY_READ])
export const DirectoryUpdatePermissions = new Set([Permission.ECS_DIRECTORY_UPDATE])
export const DirectoryDeletePermissions = new Set([Permission.ECS_DIRECTORY_DELETE])
export const DirectoryCreatePermissions = new Set([Permission.ECS_DIRECTORY_CREATE])

// TODO add missiong policy permissions
const POLICY_READ_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_READ,
  [ReconciliationEntityType.MTD]: Permission.MTD_POLICY_READ,
  [ReconciliationEntityType.ENROLLMENT]: Permission.ECS_ACTIVATIONPROFILE_READ,
  [ReconciliationEntityType.EID]: Permission.ECS_IDENTITY_READ,
  [ReconciliationEntityType.BISDetectionPolicy]: Permission.BIS_RISKPROFILE_READ,
}

const POLICY_CREATE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_CREATE,
  [ReconciliationEntityType.MTD]: Permission.MTD_POLICY_CREATE,
  [ReconciliationEntityType.ENROLLMENT]: Permission.ECS_ACTIVATIONPROFILE_CREATE,
  [ReconciliationEntityType.EID]: Permission.ECS_IDENTITY_CREATE,
  [ReconciliationEntityType.BISDetectionPolicy]: Permission.BIS_RISKPROFILE_CREATE,
}

const POLICY_UPDATE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_UPDATE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_UPDATE,
  [ReconciliationEntityType.MTD]: Permission.MTD_POLICY_UPDATE,
  [ReconciliationEntityType.ENROLLMENT]: Permission.ECS_ACTIVATIONPROFILE_UPDATE,
  [ReconciliationEntityType.EID]: Permission.ECS_IDENTITY_UPDATE,
  [ReconciliationEntityType.BISDetectionPolicy]: Permission.BIS_RISKPROFILE_UPDATE,
}

const POLICY_DELETE_PERMISSIONS_MAP = {
  [ReconciliationEntityType.NetworkAccessControl]: Permission.BIG_NETWORKACCESSCONTROLPROFILE_DELETE,
  [ReconciliationEntityType.GatewayApp]: Permission.BIG_GATEWAYAPPPROFILE_DELETE,
  [ReconciliationEntityType.MTD]: Permission.MTD_POLICY_DELETE,
  [ReconciliationEntityType.ENROLLMENT]: Permission.ECS_ACTIVATIONPROFILE_DELETE,
  [ReconciliationEntityType.EID]: Permission.ECS_IDENTITY_DELETE,
  [ReconciliationEntityType.BISDetectionPolicy]: Permission.BIS_RISKPROFILE_DELETE,
}

const PERMISSIONS_MAP = {
  [Action.READ]: POLICY_READ_PERMISSIONS_MAP,
  [Action.CREATE]: POLICY_CREATE_PERMISSIONS_MAP,
  [Action.UPDATE]: POLICY_UPDATE_PERMISSIONS_MAP,
  [Action.DELETE]: POLICY_DELETE_PERMISSIONS_MAP,
}

export const getPolicyPermission = (action: Action, policyType: ReconciliationEntityType) => {
  if (action && policyType && Object.keys(PERMISSIONS_MAP[action]).includes(policyType)) {
    return new Set([PERMISSIONS_MAP[action][policyType]])
  } else {
    return new Set([])
  }
}
