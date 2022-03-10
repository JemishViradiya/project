import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { ActionChip } from '@ues-bis/shared'
import { BasicApps, BasicGroupUser, DeviceMobile } from '@ues/assets'

import ActionTypes, { ActionLabel } from '../../../components/ActionType'

const Action = memo(({ actionType, actionAttributes: actionAttributesProp, t, deleteAction, canEdit, error }) => {
  let icon
  let name = t('policies.details.action')
  const actionAttributes = actionAttributesProp || {}
  switch (actionType) {
    case ActionTypes.UemAssignGroup.actionType:
      icon = BasicGroupUser
      name = actionAttributes.groupName || t('policies.details.unknownGroupName')
      break
    case ActionTypes.AppAssignDynamicsProfile.actionType:
      icon = BasicApps
      name = actionAttributes.profileName || t('policies.details.unknownProfileName')
      break
    case ActionTypes.UemBlockApplications.actionType:
      icon = BasicApps
      name = t('policies.details.blockDynamicsAppsAction')
      break
    case ActionTypes.AppBlockApplication.actionType:
      icon = BasicApps
      name = t('policies.details.blockInitiatedDynamicsAppAction')
      break
    case ActionTypes.MdmAssignITPolicyOverrideProfile.actionType:
      icon = DeviceMobile
      name = actionAttributes.profileName || t('policies.details.unknownPolicyName')
      break
    case ActionTypes.MdmLockWorkspace.actionType:
      icon = DeviceMobile
      name = t(ActionLabel.MdmLockWorkspace)
      break
    case ActionTypes.MdmLockDevice.actionType:
      icon = DeviceMobile
      name = t(ActionLabel.MdmLockDevice)
      break
    case ActionTypes.MdmDisableWorkspace.actionType:
      icon = DeviceMobile
      name = t(ActionLabel.MdmDisableWorkspace)
      break
    default:
      return null
  }
  return <ActionChip canEdit={canEdit} label={name} icon={icon} onDelete={deleteAction} error={error} />
})

Action.propTypes = {
  actionType: PropTypes.string.isRequired,
  actionAttributes: PropTypes.object,
  t: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  error: PropTypes.string,
}

Action.defaultProps = {
  canEdit: true,
}

export default Action
