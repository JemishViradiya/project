//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import type { TenantConfiguration } from '@ues-data/gateway'
import { useStatefulReduxMutation } from '@ues-data/shared'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'

const { StickyActions } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, clearLocalTenantConfig, getHasUnsavedTenantChanges, mutationUpdateTenantConfig } = Data
const { useStatefulNotifications } = Hooks

interface TenantStickyActionsProps {
  tenantConfigurationKeys: Array<keyof TenantConfiguration>
  disableSaveButton?: boolean
}

export const TenantStickyActions: React.FC<TenantStickyActionsProps> = ({ disableSaveButton, tenantConfigurationKeys }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()

  const hasUnsavedChanges = useSelector(state => getHasUnsavedTenantChanges(state)(tenantConfigurationKeys))
  const localTenantConfig = useSelector(getLocalTenantConfig)

  const [updateTenantConfigStartAction, updateTenantConfigTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationUpdateTenantConfig),
    {
      success: t('connectors.messageSettingsUpdated'),
      error: ({ error }) => error?.message,
    },
  )

  return (
    <StickyActions
      disableCancelButton={updateTenantConfigTask?.loading}
      disableConfirmButton={disableSaveButton}
      show={hasUnsavedChanges}
      loading={updateTenantConfigTask?.loading}
      onCancel={() => dispatch(clearLocalTenantConfig())}
      onSave={() => updateTenantConfigStartAction({ configuration: localTenantConfig })}
    />
  )
}
