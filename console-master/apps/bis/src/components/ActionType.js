import { ActionDefinition as SharedActionDefinition, ActionType as SharedActionType } from '@ues-data/bis/model'
import { ServiceId } from '@ues-data/shared'

const AppBlockApplication = { actionType: 'app:blockApplication', pillarTypeId: ServiceId.BIS }
const AppUnblockApplication = { actionType: 'app:unblockApplication', pillarTypeId: ServiceId.BIS }
const AppAssignDynamicsProfile = { actionType: 'app:assignDynamicsProfile', pillarTypeId: ServiceId.BIS }
const MdmAssignITPolicyOverrideProfile = { actionType: 'mdm:assignITPolicyOverrideProfile', pillarTypeId: ServiceId.BIS }
const MdmLockWorkspace = { actionType: 'mdm:lockWorkspace', pillarTypeId: ServiceId.BIS }
const MdmLockDevice = { actionType: 'mdm:lockDevice', pillarTypeId: ServiceId.BIS }
const MdmDisableWorkspace = { actionType: 'mdm:disableWorkspace', pillarTypeId: ServiceId.BIS }
const AssignGroup = { actionType: 'assignGroup', pillarTypeId: ServiceId.BIS }
const AssignProfile = { actionType: 'assignProfile', pillarTypeId: ServiceId.BIS }
const ReAuthenticateToConfirm = SharedActionDefinition[SharedActionType.ReAuthenticateToConfirm]
const SendAlert = { actionType: 'sendAlert', pillarTypeId: ServiceId.BIS }
const UemAssignGroup = { actionType: 'uem:assignGroup', pillarTypeId: ServiceId.BIS }
const UemAssignProfile = { actionType: 'uem:assignProfile', pillarTypeId: ServiceId.BIS }
const UemBlockApplications = { actionType: 'uem:blockApplications', pillarTypeId: ServiceId.BIS }
const UemUnblockApplications = { actionType: 'uem:unblockApplications', pillarTypeId: ServiceId.BIS }
const UemWipeDevice = { actionType: 'uem:wipeDevice', pillarTypeId: ServiceId.BIS }

const ActionType = {
  AppBlockApplication,
  AppUnblockApplication,
  AppAssignDynamicsProfile,
  MdmAssignITPolicyOverrideProfile,
  MdmLockWorkspace,
  MdmLockDevice,
  MdmDisableWorkspace,
  AssignGroup,
  AssignProfile,
  ReAuthenticateToConfirm,
  SendAlert,
  UemAssignGroup,
  UemAssignProfile,
  UemBlockApplications,
  UemUnblockApplications,
  UemWipeDevice,
}

export const ActionLabel = {
  MdmAssignITPolicyOverrideProfile: 'actions.assignITPolicyOverride',
  MdmLockWorkspace: 'actions.lockWorkProfile',
  MdmLockDevice: 'actions.lockDevice',
  MdmDisableWorkspace: 'actions.disableWorkProfile',
}

export default ActionType
