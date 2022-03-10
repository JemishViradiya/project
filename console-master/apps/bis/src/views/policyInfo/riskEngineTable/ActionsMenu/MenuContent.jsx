import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'

import { BasicApps as AppActionIcon, BasicGroupUser as GroupUserIcon, DeviceMobile as phoneIcon } from '@ues/assets'

import ActionTypes, { ActionLabel } from '../../../../components/ActionType'
import { Context as DynamicsOverrideProfilesContext } from '../../../../providers/DynamicsOverrideProfilesProvider'
import { Context as ITPolicyOverrideProfilesContext } from '../../../../providers/ITPolicyOverrideProfilesProvider'
import { Context as LocalGroupsContext } from '../../../../providers/LocalGroupsProvider'
import { Icon, useClientParams } from '../../../../shared'
import MultiTierList from './components/MultiTierList'
import { Context as TooltipToggleContext } from './providers/NestedMenuProvider'

const DEFAULT_GROUPS = { localGroups: [] }

const MenuContent = memo(
  ({
    onLockDevice,
    isGroupDisabled,
    onLockWorkspace,
    onDisableWorkspace,
    onLocalGroupAssignment,
    onAllAppsBlockAssignment,
    areMdmDeviceActionsVisible,
    isDynamicsProfileDisabled,
    isITPolicyProfileDisabled,
    onITPolicyProfileAssignment,
    onDynamicsProfileAssignment,
    onInitiatingAppsBlockAssignment,
    isBlockRequestingActionDisabled,
    areBlockRequestingActionsVisible,
    availableActions,
  }) => {
    const { data: { localGroups = [] } = DEFAULT_GROUPS } = useContext(LocalGroupsContext)
    const { data: dynamicsProfilesData = [] } = useContext(DynamicsOverrideProfilesContext)
    const { data: itPolicyProfilesData = [] } = useContext(ITPolicyOverrideProfilesContext)
    const { features: { BlackBerryGateway = false, DynamicsProfiles = false, MdmActions = false } = {} } = useClientParams()
    const setFunc = useContext(TooltipToggleContext)

    const isActionUnavailable = useCallback(
      action => {
        const isAvailable = availableActions.find(
          act => act.actionType === action.actionType && act.pillarTypeId === action.pillarTypeId,
        )
        return isAvailable === undefined
      },
      [availableActions],
    )
    const localGroupsOptions = useMemo(
      () =>
        localGroups.map(group => ({
          key: group.guid,
          title: group.name,
          showOption: true,
          onClick: () => {
            setFunc()
            onLocalGroupAssignment(group)()
          },
          disabled: isGroupDisabled(group.guid),
          alreadyTranslated: true,
        })),
      [localGroups, isGroupDisabled, onLocalGroupAssignment, setFunc],
    )
    const dyncamicsProfilesOptions = useMemo(
      () =>
        dynamicsProfilesData.map(profile => ({
          key: profile.profileGuid,
          title: profile.name,
          showOption: true,
          onClick: () => {
            setFunc()
            onDynamicsProfileAssignment(profile)()
          },
          disabled: isDynamicsProfileDisabled(profile.profileGuid),
        })),
      [dynamicsProfilesData, isDynamicsProfileDisabled, onDynamicsProfileAssignment, setFunc],
    )

    const itPolicyProfilesOptions = useMemo(
      () =>
        itPolicyProfilesData.map(policy => ({
          key: policy.profileGuid,
          title: policy.name,
          showOption: true,
          onClick: () => {
            setFunc()
            onITPolicyProfileAssignment(policy)()
          },
          disabled: isITPolicyProfileDisabled(policy.profileGuid),
        })),
      [itPolicyProfilesData, isITPolicyProfileDisabled, onITPolicyProfileAssignment, setFunc],
    )

    const areMdmDeviceActionsDisabled = useMemo(
      () =>
        isBlockRequestingActionDisabled(ActionTypes.MdmLockDevice) ||
        isBlockRequestingActionDisabled(ActionTypes.MdmLockWorkspace) ||
        isBlockRequestingActionDisabled(ActionTypes.MdmDisableWorkspace),
      [isBlockRequestingActionDisabled],
    )

    const multiTierListOptions = useMemo(
      () => [
        {
          title: 'actions.assignToUEMGroup',
          icon: <Icon icon={GroupUserIcon} />,
          showOption: true,
          secondTierOptions: localGroupsOptions,
          noSecondTierOptionsText: 'policies.details.noLocalGroupOptions',
          secondTierOptionsAsPopper: true,
          disabled: isActionUnavailable(ActionTypes.UemAssignGroup),
        },
        {
          title: 'actions.dynamicsAppsAction',
          icon: <Icon icon={AppActionIcon} />,
          showOption: DynamicsProfiles || areBlockRequestingActionsVisible,
          secondTierOptionsAsPopper: false,
          secondTierOptions: [
            {
              title: 'policies.details.assignDynamicsOverrideProfile',
              thirdTierOptions: dyncamicsProfilesOptions,
              showOption: DynamicsProfiles,
              disabled: isActionUnavailable(ActionTypes.AppAssignDynamicsProfile),
              noThirdTierOptionsText: 'policies.details.noDynamicsProfilesOptions',
            },
            {
              title: 'policies.details.blockDynamicsAppsAction',
              onClick: onAllAppsBlockAssignment,
              showOption: areBlockRequestingActionsVisible,
              disabled:
                isActionUnavailable(ActionTypes.UemBlockApplications) ||
                isBlockRequestingActionDisabled(ActionTypes.AppBlockApplication) ||
                isBlockRequestingActionDisabled(ActionTypes.UemBlockApplications),
            },
            {
              title: 'policies.details.blockInitiatedDynamicsAppAction',
              onClick: onInitiatingAppsBlockAssignment,
              showOption: areBlockRequestingActionsVisible,
              disabled:
                isActionUnavailable(ActionTypes.AppBlockApplication) ||
                isBlockRequestingActionDisabled(ActionTypes.AppBlockApplication) ||
                isBlockRequestingActionDisabled(ActionTypes.UemBlockApplications),
            },
          ],
        },
        {
          title: 'actions.deviceAction',
          icon: <Icon icon={phoneIcon} />,
          showOption: MdmActions,
          secondTierOptionsAsPopper: false,
          secondTierOptions: [
            {
              title: ActionLabel.MdmAssignITPolicyOverrideProfile,
              thirdTierOptions: itPolicyProfilesOptions,
              showOption: true,
              disabled: isActionUnavailable(ActionTypes.MdmAssignITPolicyOverrideProfile),
              noThirdTierOptionsText: 'policies.details.noITPolicyProfilesOptions',
            },
            {
              title: ActionLabel.MdmLockDevice,
              showOption: areMdmDeviceActionsVisible,
              disabled: isActionUnavailable(ActionTypes.MdmLockDevice) || areMdmDeviceActionsDisabled,
              onClick: onLockDevice,
            },
            {
              title: ActionLabel.MdmLockWorkspace,
              showOption: areMdmDeviceActionsVisible,
              disabled: isActionUnavailable(ActionTypes.MdmLockWorkspace) || areMdmDeviceActionsDisabled,
              onClick: onLockWorkspace,
            },
            {
              title: ActionLabel.MdmDisableWorkspace,
              showOption: areMdmDeviceActionsVisible,
              disabled: isActionUnavailable(ActionTypes.MdmDisableWorkspace) || areMdmDeviceActionsDisabled,
              onClick: onDisableWorkspace,
            },
          ],
        },
      ],
      [
        localGroupsOptions,
        isActionUnavailable,
        DynamicsProfiles,
        areBlockRequestingActionsVisible,
        dyncamicsProfilesOptions,
        onAllAppsBlockAssignment,
        isBlockRequestingActionDisabled,
        onInitiatingAppsBlockAssignment,
        MdmActions,
        itPolicyProfilesOptions,
        areMdmDeviceActionsVisible,
        areMdmDeviceActionsDisabled,
        onLockDevice,
        onLockWorkspace,
        onDisableWorkspace,
      ],
    )

    return <MultiTierList listOptions={multiTierListOptions} />
  },
)

MenuContent.propTypes = {
  onLockDevice: PropTypes.func,
  onDisableWorkspace: PropTypes.func,
  onAllAppsBlockAssignment: PropTypes.func,
  areMdmDeviceActionsVisible: PropTypes.bool,
  isGroupDisabled: PropTypes.func.isRequired,
  onLockWorkspace: PropTypes.func.isRequired,
  onInitiatingAppsBlockAssignment: PropTypes.func,
  isBlockRequestingActionDisabled: PropTypes.func,
  areBlockRequestingActionsVisible: PropTypes.bool,
  onLocalGroupAssignment: PropTypes.func.isRequired,
  isDynamicsProfileDisabled: PropTypes.func.isRequired,
  isITPolicyProfileDisabled: PropTypes.func.isRequired,
}

MenuContent.displayName = 'MenuContent'

export default MenuContent
