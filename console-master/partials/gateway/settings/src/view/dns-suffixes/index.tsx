//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'

import { TenantStickyActions } from '../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../constants'
import DnsSuffixesList from './dns-suffixes-list'

const { LoadingProgress } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getLocalTenantConfig, queryTenantConfig, updateLocalTenantConfig, clearLocalTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks

const DnsSuffixes: React.FC = () => {
  const { canRead, canUpdate } = useBigPermissions(BigService.Tenant)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const { loading } = useStatefulReduxQuery(queryTenantConfig, {
    skip: !canRead,
  })
  const localTenantConfig = useSelector(getLocalTenantConfig)
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(clearLocalTenantConfig())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }

  return (
    <>
      <Form
        initialValues={{ dnsSuffixEnabled: localTenantConfig?.dnsSuffixEnabled }}
        fields={[
          {
            type: 'switch',
            label: t('dns.labelDNSSuffix'),
            helpLabel: t('dns.bodyDNSSuffix'),
            name: 'dnsSuffixEnabled',
            disabled: !canUpdate,
            renderComponent: ({ fieldComponent, fieldValue: dnsSuffixEnabled, fieldClassNames }) => (
              <>
                {fieldComponent}
                {dnsSuffixEnabled && (
                  <Box className={fieldClassNames.secondary} mt={4}>
                    <DnsSuffixesList />
                  </Box>
                )}
              </>
            ),
          },
        ]}
        onChange={({ formValues: { dnsSuffixEnabled } }) => dispatch(updateLocalTenantConfig({ dnsSuffixEnabled }))}
        hideButtons
      />

      <TenantStickyActions tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.dnsSuffix} />
    </>
  )
}

export default DnsSuffixes
