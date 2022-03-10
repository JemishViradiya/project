//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import type { NetworkServicesV3 } from '@ues-data/gateway'
import { Components, Config, Data, Types, Utils } from '@ues-gateway/shared'
import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

import { DestinationEditor } from '../../../../components'

const { EntityDetailsViewBaseForm } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const {
  NetworkServicesV3: { getNetworkServiceTask, updateLocalNetworkServiceData },
} = Data
const { isSystemNetworkService } = Utils

const NetworkServiceEditor: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { id } = useParams()
  const dispatch = useDispatch()

  const networkServiceTask = useSelector(getNetworkServiceTask)

  const updateNetworkService = (payload: Partial<NetworkServicesV3.NetworkServiceEntity>) =>
    dispatch(updateLocalNetworkServiceData(payload))

  const editorComponents = [
    {
      title: t('common.generalInfo'),
      description: t('networkServices.addNetworkServiceText'),
      component: (
        <EntityDetailsViewBaseForm
          data={{ name: networkServiceTask?.data?.name, description: networkServiceTask?.data?.metadata?.description }}
          onChange={({ formValues: { name, description } }) => updateNetworkService({ name, metadata: { description } })}
        />
      ),
    },
    {
      title: t('networkServices.destinationsTitle'),
      description: t('networkServices.destinationsDescription'),
      component: (
        <DestinationEditor
          initialData={{
            networkServices: networkServiceTask?.data?.networkServices,
            targetSet: networkServiceTask?.data?.targetSet,
          }}
          networkServiceDescription={t('networkServices.destinationsNetworkServicesDescription')}
          targetSetDescription={t('networkServices.destinationsAddressAndPortDescription')}
          onNetworkServicesChange={networkServices => updateNetworkService({ networkServices })}
          onTargetSetChange={targetSet => updateNetworkService({ targetSet })}
          networkServicesDataFnArgs={{ activeNetworkServiceId: id }}
          isSystemNetworkService={isSystemNetworkService(networkServiceTask?.data?.tenantId)}
        />
      ),
    },
  ]

  return (
    <ContentArea>
      {editorComponents.map(({ title, component, description }) => (
        <ContentAreaPanel title={title}>
          {description && <Typography>{description}</Typography>}
          {component}
        </ContentAreaPanel>
      ))}
    </ContentArea>
  )
}

export default NetworkServiceEditor
