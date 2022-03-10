import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import TooltipTrigger from 'react-popper-tooltip'

import {
  Basic2FA,
  BasicApps,
  BasicApps as blockIcon,
  BasicEmail,
  BasicGroupUser,
  BasicInfo,
  DeviceMobile,
  DeviceMobile as phoneIcon,
} from '@ues/assets'

import useClientParams from '../components/hooks/useClientParams'
import useOperatingMode from '../providers/OperatingModeProvider'
import styles from './Action.module.less'
import ActionType, { ActionLabel } from './ActionType'
import useGlobalActionListener from './hooks/useGlobalActionListener'
import { Icon } from './icons/Icon'

export const ACTIVE = 'ACTIVE'
export const PASSIVE = 'PASSIVE'
const MODIFIERS = {
  preventOverflow: {
    boundariesElement: 'scrollParent',
  },
  computeStyle: {
    enabled: true,
    fn: (data, options) => {
      data.styles.top = data.offsets.reference.top - data.popper.height - 5 // 5 px for the little corner
      data.styles.left = data.offsets.reference.left + data.offsets.reference.width / 2
      data.arrowStyles.left = -1
      // Popper is too far to the right
      if (data.offsets.reference.left + data.offsets.popper.width > window.innerWidth) {
        data.styles.left = data.offsets.reference.left - data.offsets.popper.width + data.offsets.reference.width / 2
        data.arrowElement.setAttribute('width-pos', 'right') // Set corner to be right
        data.arrowStyles.left = data.offsets.popper.width
      }
      // Popper will be off screen top
      if (data.offsets.reference.top - data.offsets.popper.height < 0) {
        data.styles.top = data.offsets.reference.top + data.offsets.reference.height + 2
        data.arrowElement.setAttribute('height-pos', 'bottom') // Set corner to bottom
        data.arrowStyles.bottom = data.offsets.popper.height
      }
      return data
    },
  },
}

const listener = event => event.preventDefault()
const CustomTooltip = ({ getTooltipProps, getArrowProps, tooltipRef, arrowRef, operatingMode, actions }) => {
  useGlobalActionListener(true, listener, [
    ['click', { capture: true }],
    ['touchend', { capture: true }],
  ])
  const actionContent = useMemo(() => <Action oneColumn operatingMode={operatingMode} sisActions={{ actions: actions }} />, [
    actions,
    operatingMode,
  ])
  return (
    <div
      {...getTooltipProps({
        ref: tooltipRef,
        className: styles.popOverContainer,
      })}
    >
      <div
        {...getArrowProps({
          ref: arrowRef,
          className: styles.corner,
        })}
      />
      {actionContent}
    </div>
  )
}

const MoreActions = memo(({ actions, operatingMode }) => {
  const { t } = useTranslation()
  const newTooltip = useCallback(props => <CustomTooltip actions={actions} operatingMode={operatingMode} {...props} />, [
    actions,
    operatingMode,
  ])
  return (
    <div>
      <TooltipTrigger placement="top-start" trigger="click" modifiers={MODIFIERS} tooltip={newTooltip}>
        {({ getTriggerProps, triggerRef }) => (
          <div className={styles.moreActionsContainer} {...getTriggerProps({ ref: triggerRef })}>
            {t('actions.moreActionsCount', { numberAdditionalActions: actions.length })}
          </div>
        )}
      </TooltipTrigger>
    </div>
  )
})

MoreActions.displayName = 'MoreActions'
MoreActions.propTypes = { actions: PropTypes.array.isRequired, operatingMode: PropTypes.oneOf([PASSIVE, ACTIVE]) }

const renderItem = (style, icon, content, title) => {
  const className = cn(styles.actionItem, style)

  return (
    <span className={className}>
      <Icon className={styles.actionIcon} title={title} icon={icon} />
      <div className={styles.textOverflowEllipses}>{content}</div>
    </span>
  )
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const ActionItem = memo(({ BlackBerryGateway, operatingMode, action, t }) => {
  const active = operatingMode === ACTIVE
  const style = active ? '' : styles.passive
  const deviceActionLabel = useMemo(() => t('actions.assignedDeviceAction'), [t])
  let title = t('actions.disabledInPassiveMode')

  switch (action.type) {
    case ActionType.AssignGroup.actionType:
    case ActionType.UemAssignGroup.actionType: {
      const group = action.groupName || action.groupId
      title = active ? t('actions.assignedUserGroup') : title
      return renderItem(style, BasicGroupUser, group, title)
    }
    case ActionType.AssignProfile.actionType:
    case ActionType.UemAssignProfile.actionType:
      title = active ? `${t('actions.assignProfile')} ${action.profileId}` : title
      return renderItem(style, Basic2FA, action.profileId, title)
    case ActionType.SendAlert.actionType:
      title = active ? t('actions.sendAlert') : title
      return renderItem(style, BasicEmail, action.alertMessage, title)
    case ActionType.UemBlockApplications.actionType: {
      const blockMsg = t('actions.dynamicsAppsDisallow')
      title = active ? t('actions.assignedDynamicsApps') : title
      return renderItem(style, BasicApps, blockMsg, title)
    }
    case ActionType.UemUnblockApplications.actionType: {
      const unblockMsg = t('actions.dynamicsAppsAllow')
      title = active ? t('actions.assignedDynamicsApps') : title
      return renderItem(style, BasicApps, unblockMsg, title)
    }
    case ActionType.UemWipeDevice.actionType: {
      const wipeMsg = t('actions.deleteAllDeviceData')
      title = active ? deviceActionLabel : title
      return renderItem(style, DeviceMobile, wipeMsg, title)
    }
    case ActionType.AppBlockApplication.actionType: {
      const blockMsg = t('actions.doNotAllowAppToRun')
      title = active ? t('actions.assignedActionAppsWithScoreRequest') : title
      return renderItem(style, DeviceMobile, blockMsg, title)
    }
    case ActionType.AppUnblockApplication.actionType: {
      const unblockMsg = t('actions.allowAppToRun')
      title = active ? t('actions.assignedActionAppsWithScoreRequest') : title
      return renderItem(style, DeviceMobile, unblockMsg, title)
    }
    case ActionType.AppAssignDynamicsProfile.actionType: {
      const profile = action.profileName || action.profileId
      title = active ? t('actions.assignedDynamicsProfile') : title
      return renderItem(style, blockIcon, profile, title)
    }
    case ActionType.MdmAssignITPolicyOverrideProfile.actionType: {
      const profile = action.profileName || action.profileId
      title = active ? t('actions.assignedITPolicyOverride') : title
      return renderItem(style, phoneIcon, profile, title)
    }
    case ActionType.MdmLockWorkspace.actionType: {
      title = active ? deviceActionLabel : title
      return renderItem(style, phoneIcon, t(ActionLabel.MdmLockWorkspace), title)
    }
    case ActionType.MdmLockDevice.actionType: {
      title = active ? deviceActionLabel : title
      return renderItem(style, phoneIcon, t(ActionLabel.MdmLockDevice), title)
    }
    case ActionType.MdmDisableWorkspace.actionType: {
      title = active ? deviceActionLabel : title
      return renderItem(style, phoneIcon, t(ActionLabel.MdmDisableWorkspace), title)
    }
    case ActionType.ReAuthenticateToConfirm.actionType: {
      return null
    }
    default:
      console.log('Warning: unknown action type', action.type)
      return renderItem(style, BasicInfo, action.type, active ? action.type : title)
  }
})

const Action = memo(({ operatingMode, sisActions = {}, oneColumn, maxResultsPerColumn }) => {
  const tenantOperatingMode = useOperatingMode()
  const { features: { BlackBerryGateway = false } = {} } = useClientParams()
  const { t } = useTranslation()
  const actions = useMemo(() => {
    if (!sisActions.actions) {
      return []
    }
    const filteredActions = sisActions.actions.filter(action => action.type !== ActionType.ReAuthenticateToConfirm.actionType)
    let sisActionsList = filteredActions
    let moreResults = false
    if (filteredActions.length > maxResultsPerColumn) {
      sisActionsList = filteredActions.slice(0, maxResultsPerColumn)
      moreResults = true
    }
    const actions = (sisActionsList || []).map((action, index) => {
      if (oneColumn) {
        return (
          <div className={styles.noOverflow} key={index}>
            <ActionItem
              BlackBerryGateway={BlackBerryGateway}
              operatingMode={operatingMode || tenantOperatingMode}
              action={action}
              t={t}
            />
          </div>
        )
      }
      return (
        <ActionItem
          BlackBerryGateway={BlackBerryGateway}
          operatingMode={operatingMode || tenantOperatingMode}
          action={action}
          key={index}
          t={t}
        />
      )
    })
    if (moreResults) {
      actions[maxResultsPerColumn - 1] = (
        <div key={maxResultsPerColumn} className={styles.moreResultsWrapper}>
          {actions[maxResultsPerColumn - 1]}
          <MoreActions operatingMode={operatingMode || tenantOperatingMode} actions={filteredActions.slice(maxResultsPerColumn)} />
        </div>
      )
    }
    return actions
  }, [maxResultsPerColumn, oneColumn, operatingMode, sisActions.actions, t, tenantOperatingMode, BlackBerryGateway])

  return actions.length > 0 ? <div className={oneColumn ? styles.actions : styles.actionsRow}>{actions}</div> : null
})

Action.propTypes = {
  operatingMode: PropTypes.oneOf([PASSIVE, ACTIVE, '']),
  sisActions: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
      }),
    ),
  }),
  oneColumn: PropTypes.bool,
  maxResultsPerColumn: PropTypes.number,
}

export default Action
