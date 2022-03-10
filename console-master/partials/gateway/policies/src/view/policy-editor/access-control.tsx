//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Typography } from '@material-ui/core'

import { AccessControlType } from '@ues-data/gateway'
import { Config, Data } from '@ues-gateway/shared'
import { ButtonGroupNav, ContentAreaPanel } from '@ues/behaviours'

import AccessControlList from './access-control-list'

const { GATEWAY_TRANSLATIONS_KEY, NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY } = Config
const { getAccessControlListItems } = Data

const AccessControl: React.FC = () => {
  const listItems = useSelector(getAccessControlListItems)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const buttons = [
    {
      label: t(NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY[AccessControlType.Allowed]),
      component: <AccessControlList accessControlType={AccessControlType.Allowed} data={listItems?.[AccessControlType.Allowed]} />,
    },
    {
      label: t(NETWORK_ACCESS_RULE_LOCALIZATION_TITLE_KEY[AccessControlType.Blocked]),
      component: <AccessControlList accessControlType={AccessControlType.Blocked} data={listItems?.[AccessControlType.Blocked]} />,
    },
  ]

  return (
    <ContentAreaPanel title={t('policies.accessControl')}>
      <Typography>{t('policies.networkAccessControlPolicyInfoDescription')}</Typography>
      <ButtonGroupNav items={buttons} />
    </ContentAreaPanel>
  )
}

export default AccessControl
