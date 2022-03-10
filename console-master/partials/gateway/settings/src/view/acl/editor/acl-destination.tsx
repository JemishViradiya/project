//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import type { AclRuleDestination } from '@ues-data/gateway'
import { Config, Data } from '@ues-gateway/shared'

import { DestinationEditor } from '../../../components'
import AclMatchBuilder from './acl-match-builder'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getFetchAclRuleTask, updateLocalAclRuleData } = Data

const AclDestination: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()

  const fetchAclRuleTask = useSelector(getFetchAclRuleTask)
  const destinationData = fetchAclRuleTask?.data?.criteria?.destination

  const updateDestination = (payload: Partial<AclRuleDestination>) =>
    dispatch(updateLocalAclRuleData({ criteria: { destination: payload } }))

  return (
    <AclMatchBuilder
      initialData={destinationData}
      onChange={updateDestination}
      criteriaBuilderComponent={
        <DestinationEditor
          initialData={destinationData}
          networkServiceDescription={t('acl.destinationsNetworkServicesDescription')}
          targetSetDescription={t('acl.destinationsAddressAndPortDescription')}
          onNetworkServicesChange={networkServices => updateDestination({ networkServices })}
          onTargetSetChange={targetSet => updateDestination({ targetSet })}
          showConjunctionLabel
        />
      }
    />
  )
}

export default AclDestination
