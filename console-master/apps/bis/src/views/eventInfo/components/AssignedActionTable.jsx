import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { OperatingMode } from '@ues-data/bis/model'

import useOperatingMode from '../../../providers/OperatingModeProvider'
import { ActionLabel, ActionType, CollapsibleInfo, SimpleTable, useClientParams } from '../../../shared'

const { ACTIVE, PASSIVE } = OperatingMode

const activeColumns = [{ width: 112, accessor: 'type' }, { accessor: 'action' }]
const passiveColumns = [
  { width: 112, accessor: 'type' },
  { accessor: 'action', style: { opacity: 0.5 } },
]

const AssignedActionTable = memo(({ operatingMode, sisActions }) => {
  const { t } = useTranslation()
  const tenantOperatingMode = useOperatingMode()
  const { features: { BlackBerryGateway = false } = {} } = useClientParams()
  const opMode = operatingMode || tenantOperatingMode

  const deviceActionLabel = useMemo(() => t('actions.deviceAction'), [t])

  const actions = useMemo(() => {
    const assign = t('usersEvents.assignAction')
    // FIXME: i18n fixes needed, but needs UX
    const result = []

    if (sisActions.actions) {
      sisActions.actions.forEach(action => {
        switch (action.type) {
          case ActionType.AssignGroup.actionType:
          case ActionType.UemAssignGroup.actionType:
            result.push({
              type: t('common.group'),
              action: `${action.groupName || action.groupId} ${assign}`,
            })
            break
          case ActionType.AssignProfile.actionType:
          case ActionType.UemAssignProfile.actionType:
            result.push({
              type: t('common.profile'),
              action: `${action.profileId} ${assign}`,
            })
            break
          case ActionType.SendAlert.actionType:
            result.push({
              type: t('actions.sendAlert'),
              action: `${action.alertMessage} ${assign}`,
            })
            break
          case ActionType.UemBlockApplications.actionType:
            result.push({
              type: t('actions.dynamicsAppsAction'),
              action: t('actions.dynamicsAppsDisallow'),
            })
            break
          case ActionType.UemUnblockApplications.actionType:
            result.push({
              type: t('actions.dynamicsAppsAction'),
              action: t('actions.dynamicsAppsAllow'),
            })
            break
          case ActionType.AppBlockApplication.actionType:
            result.push({
              type: t('actions.appsWithScoreRequest'),
              action: t('actions.doNotAllowAppToRun'),
            })
            break
          case ActionType.AppUnblockApplication.actionType:
            result.push({
              type: t('actions.appsWithScoreRequest'),
              action: t('actions.allowAppToRun'),
            })
            break
          case ActionType.AppAssignDynamicsProfile.actionType:
            result.push({
              type: t('actions.dynamicsProfile'),
              action: action.profileName || action.profileId,
            })
            break
          case ActionType.UemWipeDevice.actionType:
            result.push({
              type: deviceActionLabel,
              action: t('actions.deleteAllDeviceData'),
            })
            break
          case ActionType.MdmAssignITPolicyOverrideProfile.actionType:
            result.push({
              type: t('usersEvents.itPolicyOverride'),
              action: action.profileName || action.profileId,
            })
            break
          case ActionType.MdmLockWorkspace.actionType:
            result.push({
              type: deviceActionLabel,
              action: t(ActionLabel.MdmLockWorkspace),
            })
            break
          case ActionType.MdmLockDevice.actionType:
            result.push({
              type: deviceActionLabel,
              action: t(ActionLabel.MdmLockDevice),
            })
            break
          case ActionType.MdmDisableWorkspace.actionType:
            result.push({
              type: deviceActionLabel,
              action: t(ActionLabel.MdmDisableWorkspace),
            })
            break
        }
      })
    }
    return result
  }, [sisActions, t, deviceActionLabel])

  return (
    <CollapsibleInfo title={t('usersEvents.assignedAction')}>
      <SimpleTable columns={opMode === ACTIVE ? activeColumns : passiveColumns} data={actions} />
    </CollapsibleInfo>
  )
})

AssignedActionTable.displayName = 'AssignedActionTable'
AssignedActionTable.propTypes = {
  operatingMode: PropTypes.oneOf([ACTIVE, PASSIVE]),
  sisActions: PropTypes.any,
}

export default AssignedActionTable
