//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { Permission, useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { ContentArea, ContentAreaPanel, useSecuredContent } from '@ues/behaviours'

import ConnectionHistory from './connection-history'
import ConnectorDetails from './connector-details'

const { EntityDetailsView, EntityDetailsViewBaseForm } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const {
  mutationDeleteConnector,
  queryConnector,
  mutationUpdateConnector,
  updateLocalConnectorData,
  getConnectorTask: getEntityTask,
  getHasUnsavedConnectorChanges: getHasUnsavedChanges,
  clearConnectorAction,
} = Data
const { BigService } = Hooks
const { Page } = Types
const { isConnectorNotEnrolled, makePageRoute } = Utils

const ConnectorEdit: React.FC = () => {
  useSecuredContent(Permission.BIG_TENANT_READ)
  const { id } = useParams()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'console'])
  const dispatch = useDispatch()

  const { data: connector } = useStatefulReduxQuery(queryConnector, { variables: { id } })

  return (
    <EntityDetailsView
      parentPage={makePageRoute(Page.GatewaySettingsConnectors)}
      permissions={[BigService.Tenant]}
      pageHeading={{ title: [t('labelSettings'), t('console:network.title'), t('connectors.connectors'), connector?.name] }}
      removeAction={{
        dataLayer: mutationDeleteConnector,
        notificationMessages: {
          success: t('connectors.deleteConnectorSuccessMessage'),
          error: t('connectors.deleteConnectorErrorMessage'),
        },
      }}
      saveAction={{
        dataLayer: mutationUpdateConnector,
        notificationMessages: {
          success: t('connectors.updateConnectorSuccessMessage'),
          error: ({ error }) => error?.message,
          nameAlreadyUsedError: t('policies.nameAlreadyUsedError'),
        },
      }}
      redux={{
        selectors: { getHasUnsavedChanges, getEntityTask },
        actions: { exitView: clearConnectorAction },
      }}
    >
      <ContentArea>
        <ContentAreaPanel title={t('connectors.connectorInfo')}>
          <EntityDetailsViewBaseForm
            data={connector}
            onChange={formData => dispatch(updateLocalConnectorData({ ...connector, ...formData.formValues }))}
            hideDescriptionField
            disableNameField={isConnectorNotEnrolled(connector)}
          />
        </ContentAreaPanel>

        <ConnectorDetails connector={connector} />
        <ConnectionHistory connectorId={connector?.connectorId} />
      </ContentArea>
    </EntityDetailsView>
  )
}

export default ConnectorEdit
