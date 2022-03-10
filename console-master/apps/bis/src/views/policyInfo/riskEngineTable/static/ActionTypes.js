import { ActionType } from '../../../../shared'

const {
  AppBlockApplication,
  UemAssignGroup,
  UemBlockApplications,
  AppAssignDynamicsProfile,
  MdmLockDevice,
  MdmLockWorkspace,
} = ActionType

const ActionTypes = Object.freeze({
  UemBlockApplications,
  AppBlockApplication,
  UemAssignGroup,
  AppAssignDynamicsProfile,
  MdmLockDevice,
  MdmLockWorkspace,
})

export default ActionTypes
