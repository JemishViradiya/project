//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { ReconciliationEntityType } from '@ues-data/shared-types'
import { Components, Config, Data } from '@ues-gateway/shared'
import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

import type { PolicyComponentInterface } from '../types'
import AccessControl from './access-control'
import DeviceSettings from './device-settings'
import SplitTunneling from './split-tunneling'

const { EntityDetailsViewBaseForm } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getPolicyTask, updateLocalPolicyData } = Data

const EDITOR_COMPONENTS = {
  [ReconciliationEntityType.NetworkAccessControl]: <AccessControl />,
  [ReconciliationEntityType.GatewayApp]: (
    <>
      <SplitTunneling />
      <DeviceSettings />
    </>
  ),
}

const PolicyEditor: React.FC<PolicyComponentInterface> = ({ entityType }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const fetchPolicyTask = useSelector(getPolicyTask)

  return (
    <ContentArea>
      <ContentAreaPanel title={t('common.generalInfo')}>
        <EntityDetailsViewBaseForm
          onChange={({ formValues }) => dispatch(updateLocalPolicyData(formValues))}
          data={{ name: fetchPolicyTask?.data?.name, description: fetchPolicyTask?.data?.description }}
        />
      </ContentAreaPanel>
      {EDITOR_COMPONENTS[entityType]}
    </ContentArea>
  )
}

export default PolicyEditor
