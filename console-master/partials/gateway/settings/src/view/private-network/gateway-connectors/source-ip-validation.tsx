//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { Config, Data, Hooks } from '@ues-gateway/shared'

import { TenantStickyActions } from '../../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../../constants'
import SourceIpList from './source-ip-list'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, updateLocalTenantConfig, clearLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks

const SourceIpValidation: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
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
        initialValues={{ egressSourceIPRestrictionEnabled: localTenantConfig?.egressSourceIPRestrictionEnabled }}
        fields={[
          {
            type: 'switch',
            label: t('connectors.validationIpDescription'),
            disabled: !canUpdate,
            name: 'egressSourceIPRestrictionEnabled',
            renderComponent: ({ fieldComponent, fieldValue: egressSourceIPRestrictionEnabled, fieldClassNames }) => (
              <>
                {fieldComponent}
                {egressSourceIPRestrictionEnabled && (
                  <Box className={fieldClassNames.secondary} mt={4}>
                    <SourceIpList />
                  </Box>
                )}
              </>
            ),
          },
        ]}
        onChange={({ formValues: { egressSourceIPRestrictionEnabled } }) =>
          dispatch(updateLocalTenantConfig({ egressSourceIPRestrictionEnabled }))
        }
        hideButtons
      />

      <TenantStickyActions tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.sourceIpValidation} />
    </>
  )
}

export default SourceIpValidation
