//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as httpStatus from 'http-status-codes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import type { NetworkServiceEntityPartial } from '@ues-data/gateway'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'

import NetworkServiceEditor from '../editor'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EntityDetailsView } = Components
const { BigService } = Hooks
const {
  NetworkServicesV3: {
    queryNetworkService,
    getNetworkServiceTask: getEntityTask,
    mutationUpdateNetworkService,
    mutationDeleteNetworkService,
    getHasUnsavedNetworkServiceChanges: getHasUnsavedChanges,
    getIsNetworkServiceDefinitionValid: getIsEntityDefinitionValid,
    clearNetworkService,
  },
} = Data
const { Page } = Types
const { isSystemNetworkService, makePageRoute } = Utils

const NetworkServiceEdit: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const { id } = useParams()
  const networkService = useSelector(getEntityTask)

  useStatefulReduxQuery(queryNetworkService, { variables: { id } })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewaySettingsNetworkServices)}
      permissions={[BigService.NetworkServices, 'canRead']}
      pageHeading={{ title: [t('networkServices.titleNetworkService'), networkService?.data?.name] }}
      readOnly={isSystemNetworkService(networkService?.data?.tenantId)}
      removeAction={{
        dataLayer: mutationDeleteNetworkService,
        notificationMessages: {
          success: t('networkServices.deleteNetworkServiceSuccessMessage'),
          error: ({ error }) => {
            if (error?.response?.status === httpStatus.CONFLICT) {
              const { networkServices = [], committedRules = [], draftRules = [] } = error?.response?.data?.data ?? {}
              const entities = [...networkServices, ...committedRules, ...draftRules]

              return t('networkServices.deleteNetworkServiceConflictError', {
                entityNames: entities.map((item: NetworkServiceEntityPartial) => ` ${item.name}`),
              })
            } else {
              return t('networkServices.deleteNetworkServiceErrorMessage')
            }
          },
        },
      }}
      saveAction={{
        dataLayer: mutationUpdateNetworkService,
        notificationMessages: {
          success: t('networkServices.updateNetworkServiceSuccessMessage'),
          error: t('networkServices.updateNetworkServiceErrorMessage'),
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

export default NetworkServiceEdit
