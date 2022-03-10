//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box, Link, Typography } from '@material-ui/core'

import { Form, FormFieldType } from '@ues-behaviour/hook-form'
import type { NetworkProtectionConfig } from '@ues-data/gateway'
import { AclRuleDispositionAction, GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { AsyncQuery } from '@ues-data/shared'
import { FeatureName, Permission, useFeatures, useStatefulAsyncQuery, useUesSession } from '@ues-data/shared'
import { Components, Config, Data, Types, Utils } from '@ues-gateway/shared'
import { BasicNotification, BasicVisibilityOff, StatusProtect } from '@ues/assets'

import { DISPOSITION_LOCALIZATION_KEYS } from '../../constants'
import useStyles from './styles'

const { getLocalAclRuleData, updateLocalAclRuleData } = Data
const { GATEWAY_TRANSLATIONS_KEY, DEFAULT_ACL_RULE_DATA } = Config
const { makePageRoute } = Utils
const { Page } = Types
const { EntityDetailsViewContext } = Components

export const queryNetworkProtection: AsyncQuery<NetworkProtectionConfig, { tenantId: string }> = {
  query: async ({ tenantId }) => {
    const { data } = await GatewayApi.NetworkProtection.read(tenantId)

    return data
  },
  mockQueryFn: async ({ tenantId }) => {
    const { data } = await GatewayApiMock.NetworkProtection.read(tenantId)

    return data
  },
  permissions: new Set([Permission.BIG_TENANT_READ]),
}

const AclDisposition: React.FC = () => {
  const localAclRuleData = useSelector(getLocalAclRuleData)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const classes = useStyles()
  const { tenantId } = useUesSession()
  const features = useFeatures()

  const { shouldDisableFormField } = useContext(EntityDetailsViewContext)

  const { data: networkProtectionData } = useStatefulAsyncQuery(queryNetworkProtection, { variables: { tenantId } })

  const dnsPrivacyEnabled = features.isEnabled(FeatureName.UESBigDNSPrivacyEnabled)

  const formValues = {
    ...localAclRuleData?.disposition,
    action: localAclRuleData?.disposition?.action ?? DEFAULT_ACL_RULE_DATA.disposition.action,
    ignorePort: localAclRuleData?.criteria?.destination?.ignorePort ?? DEFAULT_ACL_RULE_DATA.criteria.destination.ignorePort,
    applyBlockGatewayList:
      localAclRuleData?.disposition?.applyBlockGatewayList ?? DEFAULT_ACL_RULE_DATA.disposition.applyBlockGatewayList,
    applyBlockGatewayListMessage: networkProtectionData?.notify?.message,
    ...(dnsPrivacyEnabled && {
      privacy: localAclRuleData?.disposition?.privacy ?? false,
    }),
  }

  const hasActionOfType = (expectedAction: AclRuleDispositionAction) => expectedAction === formValues.action

  const updateDisposition = ({
    formValues: { ignorePort, action, notify = false, message, applyBlockGatewayList = false, privacy = false },
  }) =>
    dispatch(
      updateLocalAclRuleData({
        criteria: { destination: { ignorePort } },
        disposition: { action, message, applyBlockGatewayList, notify, ...(dnsPrivacyEnabled && { privacy }) },
      }),
    )

  return (
    <Form
      initialValues={formValues}
      fields={[
        {
          type: FormFieldType.Select,
          label: t('common.action'),
          name: 'action',
          options: Object.values(AclRuleDispositionAction).map(value => ({
            label: t(DISPOSITION_LOCALIZATION_KEYS[value]),
            value,
          })),
          disabled: shouldDisableFormField,
          muiProps: {
            fullWidth: false,
          },
        },
        {
          type: FormFieldType.Checkbox,
          helpLabel: t('protection.protectionDescription'),
          renderLabel: () => (
            <Box className={classes.networkProtectionLink}>
              <StatusProtect fontSize="small" />
              <Trans i18nKey="acl.applyBlockGatewayListFieldLabel" t={t}>
                <Typography>Placeholder</Typography>
                <Link onClick={() => navigate(makePageRoute(Page.GatewaySettingsNetworkProtection))}>Placeholder</Link>
              </Trans>
            </Box>
          ),
          secondary: true,
          name: 'applyBlockGatewayList',
          disabled: shouldDisableFormField,
          hidden: hasActionOfType(AclRuleDispositionAction.Block),
        },
        {
          type: FormFieldType.Text,
          name: 'applyBlockGatewayListMessage',
          disabled: true,
          tertiary: true,
          hidden: !formValues.applyBlockGatewayList || hasActionOfType(AclRuleDispositionAction.Block),
        },
        {
          type: FormFieldType.Checkbox,
          renderLabel: () => (
            <Box display="flex">
              <BasicNotification fontSize="small" />
              <Box ml={1}>
                <Typography>{t('acl.notifyFieldLabel')}</Typography>
              </Box>
            </Box>
          ),
          secondary: true,
          name: 'notify',
          disabled: shouldDisableFormField,
          hidden: hasActionOfType(AclRuleDispositionAction.Allow),
        },
        {
          type: FormFieldType.Text,
          label: t('acl.notifyMessageFieldLabel'),
          name: 'message',
          helpLabel: t('acl.notifyMessageFieldHelpLabel'),
          disabled: shouldDisableFormField,
          tertiary: true,
          hidden: !formValues.notify || hasActionOfType(AclRuleDispositionAction.Allow),
        },
        {
          type: FormFieldType.Checkbox,
          renderLabel: () => (
            <Box display="flex">
              <BasicVisibilityOff fontSize="small" />
              <Box ml={1}>
                <Typography>{t('acl.trafficPrivacy')}</Typography>
              </Box>
            </Box>
          ),
          secondary: true,
          helpLabel: t('acl.trafficPrivacyHelpLabel'),
          name: 'privacy',
          disabled: shouldDisableFormField,
          hidden: !dnsPrivacyEnabled,
        },
        {
          type: FormFieldType.Checkbox,
          label: t('acl.ignorePort'),
          secondary: true,
          helpLabel: t('acl.ignorePortHelpLabel'),
          name: 'ignorePort',
          disabled: shouldDisableFormField,
        },
      ]}
      onChange={updateDisposition}
      hideButtons
    />
  )
}

export default AclDisposition
