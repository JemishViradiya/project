import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'

import { useEventHandler } from '@ues-behaviour/react'
import { BasicAdd as PlusIcon } from '@ues/assets'

import {
  POLICY_ACTION_BLOCK_ALL,
  POLICY_ACTION_BLOCK_REQUESTING,
  POLICY_ACTION_DISABLE_WORKSPACE,
  POLICY_ACTION_LOCK_DEVICE,
  POLICY_ACTION_LOCK_WORKSPACE,
} from '../../../../config/consts/dialogIds'
import { Context as AvailableActionsContext } from '../../../../providers/AvailableActionsProvider'
import { ActionType as ActionTypes, IconButton } from '../../../../shared'
import {
  BlockAllModal,
  BlockRequestingModal,
  DisableWorkspaceModal,
  LockDeviceModal,
  LockWorkspaceModal,
} from './AssignActionModal'
import { NestedMenu } from './components/NestedMenu'
import MenuContent from './MenuContent'

const ActionTrigger = memo(({ t }) => (
  <Box>
    <IconButton size="small" title={t('policies.details.addAction')}>
      <PlusIcon />
    </IconButton>
  </Box>
))

const defaultLockActionValues = Object.freeze({
  gracePeriod: 30,
})

const handleEvent = e => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export const getActionAttributes = periodValue => ({
  gracePeriod: periodValue * 60, // converting minutes into seconds
})

const ActionsMenu = ({ addAction, actions, areBlockRequestingActionsVisible, areMdmDeviceActionsVisible, canEdit }) => {
  const { t } = useTranslation()
  const { data: availableActions = [] } = useContext(AvailableActionsContext)
  const [dialogBlockAll, setDialogBlockAll] = useState({})
  const [dialogBlockRequesting, setDialogBlockRequesting] = useState({})
  const [dialogLockWorkspace, setDialogLockWorkspace] = useState({})
  const [dialogLockDevice, setDialogLockDevice] = useState({})
  const [dialogDisableWorkspace, setDialogDisableWorkspace] = useState({})
  const openDialogBlockAll = useEventHandler(() => setDialogBlockAll({ dialogId: POLICY_ACTION_BLOCK_ALL }), [])
  const openDialogBlockRequesting = useEventHandler(
    () => setDialogBlockRequesting({ dialogId: POLICY_ACTION_BLOCK_REQUESTING }),
    [],
  )
  const openDialogLockWorkspace = useEventHandler(() => setDialogLockWorkspace({ dialogId: POLICY_ACTION_LOCK_WORKSPACE }), [])
  const openDialogLockDevice = useEventHandler(() => setDialogLockDevice({ dialogId: POLICY_ACTION_LOCK_DEVICE }), [])
  const openDialogDisableWorkspace = useEventHandler(
    () => setDialogDisableWorkspace({ dialogId: POLICY_ACTION_DISABLE_WORKSPACE }),
    [],
  )
  const closeDialogBlockAll = useCallback(() => setDialogBlockAll({}), [])
  const closeDialogBlockRequesting = useCallback(() => setDialogBlockRequesting({}), [])
  const closeDialogLockWorkspace = useCallback(() => setDialogLockWorkspace({}), [])
  const closeDialogLockDevice = useCallback(() => setDialogLockDevice({}), [])
  const closeDialogDisableWorkspace = useCallback(() => setDialogDisableWorkspace({}), [])

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultLockActionValues,
    criteriaMode: 'all',
  })
  const { register, watch, errors } = formMethods

  const handleAllAppsBlockAssignment = useCallback(
    (_, e) => {
      handleEvent(e)
      addAction({ ...ActionTypes.UemBlockApplications, actionAttributes: {} })
      closeDialogBlockAll()
    },
    [addAction, closeDialogBlockAll],
  )

  const handleInitiatingAppsBlockAssignment = useCallback(
    (_, e) => {
      handleEvent(e)
      addAction({ ...ActionTypes.AppBlockApplication, actionAttributes: {} })
      closeDialogBlockRequesting()
    },
    [closeDialogBlockRequesting, addAction],
  )

  const handleLocalGroupAssignment = useCallback(
    ({ guid, name }, e) => () => {
      handleEvent(e)
      const groupActionAttribute = { groupGuid: guid, groupName: name }
      addAction({ ...ActionTypes.UemAssignGroup, actionAttributes: groupActionAttribute })
    },
    [addAction],
  )

  const handleDynamicsProfileAssignment = useCallback(
    ({ profileGuid, name }, e) => () => {
      handleEvent(e)
      const profileActionAttribute = { profileGuid: profileGuid, profileName: name }
      addAction({ ...ActionTypes.AppAssignDynamicsProfile, actionAttributes: profileActionAttribute })
    },
    [addAction],
  )

  const handleITPolicyProfileAssignment = useCallback(
    ({ profileGuid, name }, e) => () => {
      handleEvent(e)
      const profileActionAttribute = { profileGuid: profileGuid, profileName: name }
      addAction({ ...ActionTypes.MdmAssignITPolicyOverrideProfile, actionAttributes: profileActionAttribute })
    },
    [addAction],
  )

  const handleLockWorkspace = useCallback(
    ({ gracePeriod }, e) => {
      handleEvent(e)
      const actionAttributes = getActionAttributes(gracePeriod)
      addAction({ ...ActionTypes.MdmLockWorkspace, actionAttributes })
      closeDialogLockWorkspace()
    },
    [addAction, closeDialogLockWorkspace],
  )

  const handleLockDevice = useCallback(
    ({ gracePeriod }, e) => {
      handleEvent(e)
      const actionAttributes = getActionAttributes(gracePeriod)
      addAction({ ...ActionTypes.MdmLockDevice, actionAttributes })
      closeDialogLockDevice()
    },
    [addAction, closeDialogLockDevice],
  )

  const handleDisableWorkspace = useCallback(() => {
    addAction({ ...ActionTypes.MdmDisableWorkspace, actionAttributes: {} })
    closeDialogDisableWorkspace()
  }, [closeDialogDisableWorkspace, addAction])

  // TODO: what possible reason could we have to submit the form here ?
  // const onSubmitLockWorkspace = useMemo(() => handleSubmit(handleLockWorkspace), [handleSubmit, handleLockWorkspace])
  // const onSubmitLockDevice = useMemo(() => handleSubmit(handleLockDevice), [handleSubmit, handleLockDevice])
  const onSubmitLockWorkspace = handleLockWorkspace
  const onSubmitLockDevice = handleLockDevice

  const isBlockRequestingActionDisabled = useCallback(
    type => actions.findIndex(action => action.actionType === type.actionType) !== -1,
    [actions],
  )

  /* Keep for v3.1+
  const isGroupDisabled = useCallback(
    guid =>
      actions.findIndex(
        action =>
          action.actionType === ActionTypes.UemAssignGroup && action.actionAttributes.groupGuid === guid,
      ) !== -1,
    [actions],
  )
  */

  // Refer to: https://jira.bbqnx.net/browse/SIS-5213

  const isGroupDisabled = useCallback(
    () =>
      actions.findIndex(
        action => action.actionType === ActionTypes.UemAssignGroup.actionType && action.actionAttributes.groupGuid,
      ) !== -1,
    [actions],
  )

  const isDynamicsProfileDisabled = useCallback(
    () =>
      actions.findIndex(
        action => action.actionType === ActionTypes.AppAssignDynamicsProfile.actionType && action.actionAttributes.profileGuid,
      ) !== -1,
    [actions],
  )

  const isITPolicyProfileDisabled = useCallback(
    () =>
      actions.findIndex(
        action =>
          action.actionType === ActionTypes.MdmAssignITPolicyOverrideProfile.actionType && action.actionAttributes.profileGuid,
      ) !== -1,
    [actions],
  )

  const getDefaultGracePeriod = useCallback(
    action => {
      const foundAction = availableActions.find(
        act => act.actionType === action.actionType && act.pillarTypeId === action.pillarTypeId,
      )
      return foundAction?.client?.userInputs?.gracePeriod / 60
    },
    [availableActions],
  )

  return (
    <>
      <NestedMenu trigger={<ActionTrigger t={t} />} triggerVisibility={canEdit} label={t('policies.details.assignActionMenu')}>
        <MenuContent
          onLocalGroupAssignment={handleLocalGroupAssignment}
          onDynamicsProfileAssignment={handleDynamicsProfileAssignment}
          onITPolicyProfileAssignment={handleITPolicyProfileAssignment}
          onAllAppsBlockAssignment={openDialogBlockAll}
          onInitiatingAppsBlockAssignment={openDialogBlockRequesting}
          onLockWorkspace={openDialogLockWorkspace}
          onLockDevice={openDialogLockDevice}
          onDisableWorkspace={openDialogDisableWorkspace}
          areBlockRequestingActionsVisible={areBlockRequestingActionsVisible}
          isBlockRequestingActionDisabled={isBlockRequestingActionDisabled}
          isGroupDisabled={isGroupDisabled}
          areMdmDeviceActionsVisible={areMdmDeviceActionsVisible}
          isDynamicsProfileDisabled={isDynamicsProfileDisabled}
          isITPolicyProfileDisabled={isITPolicyProfileDisabled}
          availableActions={availableActions}
        />
      </NestedMenu>
      <BlockAllModal onAssign={handleAllAppsBlockAssignment} onCancel={closeDialogBlockAll} dialogId={dialogBlockAll.dialogId} />
      <BlockRequestingModal
        onAssign={handleInitiatingAppsBlockAssignment}
        onCancel={closeDialogBlockRequesting}
        dialogId={dialogBlockRequesting.dialogId}
      />
      <LockDeviceModal
        onAssign={onSubmitLockDevice}
        onCancel={closeDialogLockDevice}
        dialogId={dialogLockDevice.dialogId}
        register={register}
        watch={watch}
        errors={errors}
        gracePeriod={getDefaultGracePeriod(ActionTypes.MdmLockDevice)}
      />
      <LockWorkspaceModal
        onAssign={onSubmitLockWorkspace}
        onCancel={closeDialogLockWorkspace}
        dialogId={dialogLockWorkspace.dialogId}
        register={register}
        watch={watch}
        errors={errors}
        gracePeriod={getDefaultGracePeriod(ActionTypes.MdmLockWorkspace)}
      />
      <DisableWorkspaceModal
        onAssign={handleDisableWorkspace}
        onCancel={closeDialogDisableWorkspace}
        dialogId={dialogDisableWorkspace.dialogId}
      />
    </>
  )
}

ActionsMenu.propTypes = {
  addAction: PropTypes.func.isRequired,
  actions: PropTypes.array,
  areBlockRequestingActionsVisible: PropTypes.bool.isRequired,
  areMdmDeviceActionsVisible: PropTypes.bool.isRequired,
}

ActionsMenu.displayName = 'ActionsMenu'

export default ActionsMenu
