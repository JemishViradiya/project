//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'
import type { ValidateResult } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Form } from '@ues-behaviour/hook-form'
import { Config, Data, Hooks, Utils } from '@ues-gateway/shared'

import { TenantStickyActions } from '../../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../../constants'

const { GATEWAY_TRANSLATIONS_KEY, MAX_PRIVATE_NETWORK_SUFFIX } = Config
const { getLocalTenantConfig, updateLocalTenantConfig, clearLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks
const { isValidIPV4CIDR } = Utils

const IpRangeForm: React.FC = () => {
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
      <Form
        initialValues={{ tunnelPrivateIpV4Range: localTenantConfig?.tunnelPrivateIpV4Range }}
        onValidationChange={({ isFormValid }) => setIsFormValid(isFormValid)}
        fields={[
          {
            type: 'text',
            name: 'tunnelPrivateIpV4Range',
            label: t('privateNetwork.ipRangeLabel'),
            helpLabel: t('privateNetwork.ipRangeHelpLabel'),
            required: true,
            disabled: !canUpdate,
            muiProps: {
              fullWidth: false,
            },
            validationRules: {
              required: { value: true, message: t('common.requiredFieldErrorMessage') },
              validate: value => {
                if (!isValidIPV4CIDR(value as string)) {
                  return t('privateNetwork.ipRangeInvalidCidr') as ValidateResult
                }

                if (!isValidIPV4CIDR(value as string, MAX_PRIVATE_NETWORK_SUFFIX)) {
                  return t('privateNetwork.ipRangeInvalidSuffix') as ValidateResult
                }

                return true
              },
            },
          },
        ]}
        onChange={({ formValues: { tunnelPrivateIpV4Range } }) => dispatch(updateLocalTenantConfig({ tunnelPrivateIpV4Range }))}
        hideButtons
      />
      <TenantStickyActions
        tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.privateNetworkIps}
        disableSaveButton={!isFormValid}
      />
    </>
  )
}

export default IpRangeForm
