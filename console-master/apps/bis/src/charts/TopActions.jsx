import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import stringHash from 'string-hash'

import ActionType, { ActionLabel } from '../components/ActionType'
import Placeholder from '../components/widgets/Placeholder'
import TopItems from '../components/widgets/TopItems'
import { Context } from '../providers/StateProvider'
import TopActionsProvider from '../providers/TopActionsProvider'
import PlaceholderBars from '../static/PlaceholderBars.svg'

const TopCount = 3

const getTitle = (action, t) => {
  switch (action.type) {
    case ActionType.AssignGroup.actionType:
    case ActionType.UemAssignGroup.actionType:
      return `${t('dashboard.topActionAssignTo')} ${action.groupName || stringHash(action.groupId)}`
    case ActionType.AssignProfile.actionType:
    case ActionType.UemAssignProfile.actionType:
      return `${t('actions.assignProfile')} ${stringHash(action.profileId)}`
    case ActionType.SendAlert.actionType:
      return t('actions.sendAlert')
    case ActionType.UemBlockApplications.actionType:
      return t('actions.dynamicsAppsDisallow')
    case ActionType.UemUnblockApplications.actionType:
      return t('actions.dynamicsAppsAllow')
    case ActionType.UemWipeDevice.actionType:
      return t('actions.deleteAllDeviceData')
    case ActionType.AppBlockApplication.actionType:
      return t('actions.doNotAllowAppToRun')
    case ActionType.AppUnblockApplication.actionType:
      return t('actions.allowAppToRun')
    case ActionType.AppAssignDynamicsProfile.actionType:
      return action.profileName || action.profileId
    case ActionType.MdmAssignITPolicyOverrideProfile.actionType:
      return action.profileName || action.profileId
    case ActionType.MdmLockWorkspace.actionType:
      return t(ActionLabel.MdmLockWorkspace)
    case ActionType.MdmLockDevice.actionType:
      return t(ActionLabel.MdmLockDevice)
    case ActionType.MdmDisableWorkspace.actionType:
      return t(ActionLabel.MdmDisableWorkspace)
    default:
      console.log('Warning: unknown action type', action.type)
      return action.type
  }
}

const TopActions = memo(({ width, height }) => {
  const { t } = useTranslation()
  const renderData = useCallback(
    ({ data }) => {
      if (!data || !data.topActions) {
        return null
      }

      const items = data.topActions.map(item => {
        return {
          title: getTitle(item.action, t),
          total: item.count,
        }
      })

      if (items.length === 0) {
        return (
          <Placeholder
            graphic={PlaceholderBars}
            heading="dashboard.noActions"
            description="dashboard.noActionsDescription"
            width={width}
            height={height}
          />
        )
      }
      return <TopItems items={items} width={width} height={height} />
    },
    [height, t, width],
  )

  const { currentTimePeriod: range } = useContext(Context)
  const variables = useMemo(
    () => ({
      range,
      count: TopCount,
    }),
    [range],
  )
  return (
    <TopActionsProvider variables={variables}>
      <TopActionsProvider.Consumer>{renderData}</TopActionsProvider.Consumer>
    </TopActionsProvider>
  )
})

TopActions.displayName = 'TopActions'

export default TopActions
