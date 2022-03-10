//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Form, FormFieldType } from '@ues-behaviour/hook-form'
import { FeatureName, FeaturizationApi, RiskLevel, useStatefulReduxMutation, useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'

import { PICK_NETWORK_PROTECTION_CONFIG_PROPERTIES } from '../constants'

const { LoadingProgress, StickyActions } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const {
  getLocalNetworkProtectionConfig,
  queryNetworkProtectionConfig,
  clearLocalNetworkProtectionConfig,
  updateLocalNetworkProtectionConfig,
  getHasUnsavedNetworkProtectionChanges,
  mutationUpdateNetworkProtectionConfig,
} = Data
const { BigService, useBigPermissions, useStatefulNotifications } = Hooks

const NOTIFICATION_MESSAGE_MAX_LENGTH = 250

const REPUTATION_LEVEL_LABELS = {
  [RiskLevel.Low]: 'components:risk.low',
  [RiskLevel.Medium]: 'components:risk.medium',
  [RiskLevel.High]: 'components:risk.high',
}

const NetworkProtection: React.FC = () => {
  const { canRead, canUpdate } = useBigPermissions(BigService.Tenant)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'components'])

  const hasUnsavedChanges = useSelector(state =>
    getHasUnsavedNetworkProtectionChanges(state)(PICK_NETWORK_PROTECTION_CONFIG_PROPERTIES),
  )
  const [isFormValid, setIsFormValid] = useState<boolean>()

  const { loading } = useStatefulReduxQuery(queryNetworkProtectionConfig, {
    skip: !canRead,
  })
  const localNetworkProtectionConfig = useSelector(getLocalNetworkProtectionConfig)
  const dispatch = useDispatch()
  const fieldDisabled = !canUpdate || loading

  const [updateNetworkProtectionConfigStartAction, updateNetworkProtectionConfigTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationUpdateNetworkProtectionConfig),
    {
      success: t('connectors.messageSettingsUpdated'),
      error: ({ error }) => error?.message,
    },
  )

  useEffect(() => {
    return () => {
      dispatch(clearLocalNetworkProtectionConfig())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }

  return (
    <>
      <Form
        initialValues={{
          intrusionProtectionEnabled: localNetworkProtectionConfig?.intrusionProtectionEnabled ?? true,
          notify: {
            enabled: localNetworkProtectionConfig?.notify?.enabled ?? false,
            message: localNetworkProtectionConfig?.notify?.message ?? '',
          },
          reputationProtectionEnabled: localNetworkProtectionConfig?.ipRep?.enabled ?? true,
          reputationProtectionLevel: (localNetworkProtectionConfig?.ipRep?.threshold ?? RiskLevel.High).toLowerCase(),
        }}
        fields={[
          {
            type: FormFieldType.Switch,
            label: t('acl.notifyFieldLabel'),
            name: 'notify.enabled',
            disabled: fieldDisabled,
          },
          {
            type: FormFieldType.Text,
            label: t('acl.notifyMessageFieldLabel'),
            hidden: !localNetworkProtectionConfig?.notify?.enabled,
            name: 'notify.message',
            helpLabel: t('acl.notifyMessageFieldHelpLabel'),
            secondary: true,
            disabled: fieldDisabled,
            validationRules: {
              maxLength: {
                value: NOTIFICATION_MESSAGE_MAX_LENGTH,
                message: t('common.nameFieldMaxLengthValidationMessage', { value: NOTIFICATION_MESSAGE_MAX_LENGTH }),
              },
            },
          },
          {
            type: FormFieldType.Switch,
            label: t('protection.labelIntrusionProtectionMode'),
            helpLabel: t('protection.protectionHelpLabel'),
            name: 'intrusionProtectionEnabled',
            disabled: fieldDisabled,
          },
          {
            type: FormFieldType.Switch,
            label: t('protection.labelEnableReputation'),
            helpLabel: t('protection.reputationProtectionHelpLabel'),
            name: 'reputationProtectionEnabled',
            hidden: !FeaturizationApi.isFeatureEnabled(FeatureName.UESBigIpRepEnabled),
            disabled: fieldDisabled,
          },
          {
            name: 'reputationProtectionLevel',
            label: t('common.minRiskLevel'),
            helpLabel: t('protection.reputationProtectionHelpLabel'),
            disabled: fieldDisabled,
            tertiary: true,
            type: FormFieldType.Select,
            hidden:
              !FeaturizationApi.isFeatureEnabled(FeatureName.UESBigIpRepEnabled) || !localNetworkProtectionConfig?.ipRep?.enabled,
            muiProps: {
              fullWidth: false,
            },
            options: Object.entries(REPUTATION_LEVEL_LABELS).map(([value, labelTranslationKey]) => ({
              value: value.toLowerCase(),
              label: t(labelTranslationKey),
            })),
          },
        ]}
        onChange={({
          formValues: { intrusionProtectionEnabled, notify, reputationProtectionEnabled, reputationProtectionLevel },
        }) =>
          dispatch(
            updateLocalNetworkProtectionConfig({
              intrusionProtectionEnabled,
              notify,
              ipRep: {
                enabled: reputationProtectionEnabled,
                threshold: reputationProtectionLevel,
              },
            }),
          )
        }
        onValidationChange={({ isFormValid }) => setIsFormValid(isFormValid)}
        hideButtons
      />

      <StickyActions
        disableConfirmButton={!isFormValid}
        disableCancelButton={updateNetworkProtectionConfigTask?.loading}
        show={hasUnsavedChanges}
        loading={updateNetworkProtectionConfigTask?.loading}
        onCancel={() => dispatch(clearLocalNetworkProtectionConfig())}
        onSave={() => updateNetworkProtectionConfigStartAction({ configuration: localNetworkProtectionConfig })}
      />
    </>
  )
}

export default NetworkProtection
