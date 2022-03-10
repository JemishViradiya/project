import type { VariantType } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { uniqueValues } from '@ues-bis/shared'
import { ActionDefinition, ActionError, ActionType, RiskLevelTypes } from '@ues-data/bis/model'
import { useBaseProfilesData } from '@ues-data/platform'
import { ReconciliationEntityType, ServiceId } from '@ues-data/shared'
import { usePopover, useSnackbar } from '@ues/behaviours'

import { TRANSLATION_NAMESPACES } from '../../../../config'
import { useSettings } from '../../../../hooks/use-settings'
import type { PolicyData } from '../../../../model'
import { canAddAction, getIdByAction, identityActionsAccessor } from '../../../../utils'
import AssignNetworkAccessPolicyDialog from './AssignNetworkAccessPolicyDialog'
import { RiskEngineTablesContainer } from './tables'

export interface RiskEnginesSettingsFieldProps {
  onChange: (value: PolicyData) => void
  readOnly: boolean
  value: PolicyData
}

const riskLevels = [RiskLevelTypes.HIGH]

export const RiskEnginesSettingsField: React.FC<RiskEnginesSettingsFieldProps> = ({ value, onChange, readOnly }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const { enqueueMessage } = useSnackbar()
  const actions = useMemo(() => value?.identityPolicy?.riskLevelActions ?? [], [value])
  const [
    {
      data: { riskEnginesSettings } = { riskEnginesSettings: undefined },
      loading: riskEnginesSettingsLoading,
      error: riskEnginesSettingsError,
    },
  ] = useSettings()
  const enabledRiskFactors = value?.identityPolicy?.riskFactors.filter(riskFactor => riskEnginesSettings?.[riskFactor]?.enabled)
  const {
    profilesData: networkAccessPolicies,
    profilesLoading: networkAccessPoliciesLoading,
    profilesError: networkAccessPoliciesError,
  } = useBaseProfilesData(ServiceId.BIG, ReconciliationEntityType.NetworkAccessControl, (message, type: VariantType) =>
    enqueueMessage(message, type),
  )

  const networkAccessOptions = useMemo(() => {
    const options =
      networkAccessPolicies?.profiles?.elements?.map(group => ({
        label: group.name,
        value: group.entityId,
      })) ?? []
    if (!options.length) {
      options.push({ label: t('bis/ues:actions.assignNetworkAccessPolicy.dialog.noOptions'), value: '' })
    }
    return options
  }, [networkAccessPolicies?.profiles?.elements, t])

  const networkAccessPoliciesLoaded = useMemo(() => !networkAccessPoliciesLoading && !networkAccessPoliciesError, [
    networkAccessPoliciesError,
    networkAccessPoliciesLoading,
  ])
  const riskEnginesSettingsLoaded = useMemo(() => !riskEnginesSettingsLoading && !riskEnginesSettingsError, [
    riskEnginesSettingsError,
    riskEnginesSettingsLoading,
  ])
  const checkForActionsError = networkAccessPoliciesLoaded && riskEnginesSettingsLoaded

  const riskFactors = useMemo(() => enabledRiskFactors || [], [enabledRiskFactors])

  const actionsError = useMemo(() => {
    const errors = {}
    if (checkForActionsError) {
      actions.forEach(({ level, actions: actionsPerLevel }) => {
        if (riskLevels.some(riskLevel => riskLevel === level)) {
          actionsPerLevel.forEach(action => {
            if (
              action.actionType === ActionType.OverrideNetworkAccessControlPolicy &&
              !networkAccessOptions?.find(option => option.value === action.actionAttributes.entityId)
            ) {
              errors[getIdByAction(level, action)] = ActionError.NetworkAccessPolicyDoesntExist
            }
          })
        }
      })
    }
    return errors
  }, [checkForActionsError, actions, networkAccessOptions])

  useEffect(() => {
    if (checkForActionsError) {
      uniqueValues(Object.values(actionsError)).forEach(actionError => {
        if (actionError === ActionError.NetworkAccessPolicyDoesntExist) {
          enqueueMessage(t('bis/ues:actions.selected.networkAccessPolicy.errorSnackbar'), 'error')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkForActionsError])

  const addAction = useCallback(
    (action, actionsAccessor) => {
      const clone = JSON.parse(JSON.stringify(value))
      const actions = actionsAccessor(clone)

      if (canAddAction(actions, action)) {
        actions.push(action)
        onChange(clone)
      }
    },
    [onChange, value],
  )

  const onAssignNetworkAccessPolicy = useCallback(
    level => entityId => {
      const action = {
        ...ActionDefinition[ActionType.OverrideNetworkAccessControlPolicy],
        actionAttributes: {
          entityId,
        },
      }

      addAction(action, identityActionsAccessor(level))
    },
    [addAction],
  )

  const actionPickerPopover = usePopover()
  const [assignNetworkAccessPolicyDialogState, setAssignNetworkAccessPolicyDialogState] = useState<any>({ t })
  const openAssignNetworkAccessPolicyDialog = useCallback(
    level => {
      actionPickerPopover.handlePopoverClose()
      setAssignNetworkAccessPolicyDialogState({
        dialogId: Symbol('dialog-id'),
        policies: networkAccessOptions,
        onSave: onAssignNetworkAccessPolicy(level),
        t,
      })
    },
    [actionPickerPopover, networkAccessOptions, onAssignNetworkAccessPolicy, t],
  )

  const actionState = useMemo(
    () => ({
      popover: actionPickerPopover,
      handleOpenDialog: openAssignNetworkAccessPolicyDialog,
      actionsError,
      networkAccessOptions,
    }),
    [actionPickerPopover, actionsError, networkAccessOptions, openAssignNetworkAccessPolicyDialog],
  )

  return (
    <>
      <RiskEngineTablesContainer
        onChange={onChange}
        value={value}
        actionState={actionState}
        riskLevels={riskLevels}
        riskFactors={riskFactors}
        readOnly={readOnly}
      />

      <AssignNetworkAccessPolicyDialog {...assignNetworkAccessPolicyDialogState} />
    </>
  )
}
