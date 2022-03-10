//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import NetworkServiceEditor from '../editor'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { BigService } = Hooks
const {
  NetworkServicesV3: {
    mutationCreateNetworkService,
    getHasUnsavedNetworkServiceChanges: getHasUnsavedChanges,
    getNetworkServiceTask: getEntityTask,
    getIsNetworkServiceDefinitionValid: getIsEntityDefinitionValid,
    clearNetworkService,
  },
} = Data
const { EntityDetailsView } = Components
const { Page } = Types
const { makePageRoute } = Utils

const NetworkServiceAdd: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewaySettingsNetworkServices)}
      permissions={[BigService.NetworkServices, 'canCreate']}
      pageHeading={{ title: t('networkServices.labelAddNetworkService') }}
      saveAction={{
        dataLayer: mutationCreateNetworkService,
        notificationMessages: {
          success: t('networkServices.createNetworkServiceSuccessMessage'),
          error: t('networkServices.createNetworkServiceErrorMessage'),
          nameAlreadyUsedError: t('networkServices.nameAlreadyUsedError'),
        },
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask, getIsEntityDefinitionValid },
        actions: { exitView: clearNetworkService },
      }}
    >
      <NetworkServiceEditor />
    </EntityDetailsView>
  )
}

export default NetworkServiceAdd
