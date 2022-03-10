//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'
import type { ValidateResult } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { Config, Data, Hooks, Utils } from '@ues-gateway/shared'
import { AriaElementLabel } from '@ues/assets-e2e'

import { TenantStickyActions } from '../../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../../constants'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, updateLocalTenantConfig, clearLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks
const { isIPHost, isValidUrl } = Utils

const HealthCheckUrl: React.FC = () => {
  const [isFormValid, setIsFormValid] = useState<boolean>()
  const dispatch = useDispatch()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const localTenantConfig = useSelector(getLocalTenantConfig)
  const { canUpdate } = useBigPermissions(BigService.Tenant)

  useEffect(() => {
    return () => {
      dispatch(clearLocalTenantConfig())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Typography component="p" aria-label={AriaElementLabel.HealthCheckDesc}>
        {t('connectors.healthCheckUrlDescription')}
      </Typography>
      <Form
        initialValues={{ healthCheckUrl: localTenantConfig?.healthCheckUrl }}
        onValidationChange={({ isFormValid }) => setIsFormValid(isFormValid)}
        fields={[
          {
            type: 'text',
            name: 'healthCheckUrl',
            label: t('connectors.healthCheckUrl'),
            disabled: !canUpdate,
            validationRules: {
              required: { value: true, message: t('common.requiredFieldErrorMessage') },
              validate: value => {
                if (!isValidUrl(value as string)) {
                  return t('connectors.healthCheckUrlValidationMessage') as ValidateResult
                }

                if (isIPHost(value as string)) {
                  return t('connectors.healthCheckUrlValidationMessageIP') as ValidateResult
                }

                return true
              },
            },
          },
        ]}
        onChange={({ formValues: { healthCheckUrl } }) => dispatch(updateLocalTenantConfig({ healthCheckUrl }))}
        hideButtons
      />
      <TenantStickyActions
        tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.healthCheckUrl}
        disableSaveButton={!isFormValid}
      />
    </>
  )
}

export default HealthCheckUrl
