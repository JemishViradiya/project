//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import { usePrevious } from '@ues-behaviour/react'
import type { ConnectorConfigInfo } from '@ues-data/gateway'
import { useStatefulReduxMutation, useUesSession } from '@ues-data/shared'
import { Config, Data, Hooks, Types, Utils } from '@ues-gateway/shared'
import { ContentArea, ContentAreaPanel, PageTitlePanel, useSnackbar } from '@ues/behaviours'

import { enrollConnector, getConnectorPublicKey } from './utils'

const { Page, GatewayRouteParamName } = Types

const { useStatefulNotifications } = Hooks
const { isTaskResolved, makePageRoute } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { mutationCreateConnector } = Data

const ConnectorAdd: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { enqueueMessage } = useSnackbar()

  const [createConnectorStartAction, createConnectorTask] = useStatefulNotifications(
    useStatefulReduxMutation(mutationCreateConnector),
    {
      success: t('connectors.createConnectorSuccessMessage'),
      error: ({ error }) => error?.message,
    },
  )

  let connectorUrl = searchParams.get(GatewayRouteParamName.ConnectorUrl)
  if (connectorUrl) {
    connectorUrl = decodeURIComponent(connectorUrl)
    connectorUrl = atob(connectorUrl)
  }

  const prevCreateConnectorTask = usePrevious(createConnectorTask)
  const { tenantId } = useUesSession()

  const navigateBack = () => navigate(makePageRoute(Page.GatewaySettingsConnectors))

  useEffect(() => {
    async function enroll() {
      if (isTaskResolved(createConnectorTask, prevCreateConnectorTask)) {
        const data = createConnectorTask.data
        try {
          enrollConnector(connectorUrl, data.connectorId, data.serviceApiGatewayUrl, tenantId)
          enqueueMessage(t('connectors.connectorCreated'), 'success')
          navigateBack()
        } catch (error) {
          enqueueMessage(t('connectors.failedToEnrollConnector'), 'error')
        }
      }
    }
    enroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createConnectorTask, prevCreateConnectorTask, navigate, connectorUrl])

  return (
    <>
      <PageTitlePanel title={[t('labelGateway'), t('labelSettings'), t('connectors.createConnector')]} />
      <ContentArea>
        <ContentAreaPanel title={t('connectors.labelCreateConnector')}>
          <Typography>{t('connectors.createConnectorDescription')}</Typography>
          <Typography>{t('connectors.createConnectorAuthorization', { URL: connectorUrl })}</Typography>
          <Form
            initialValues={{ name: '', connectorUrl: connectorUrl || '' }}
            fields={[
              {
                type: 'text',
                name: 'connectorUrl',
                label: t('connectors.connectorUrl'),
                disabled: true, // Don't allow user to edit this property
                validationRules: {
                  required: {
                    value: true,
                    message: t('connectors.connectorUrlIsRequired'),
                  },
                },
              },
              {
                type: 'text',
                required: true,
                name: 'name',
                label: t('connectors.connectorName'),
                disabled: createConnectorTask.loading,
                validationRules: {
                  required: {
                    value: true,
                    message: t('connectors.connectorNameIsRequired'),
                  },
                },
              },
            ]}
            onSubmit={async data => {
              try {
                const jwtToken = await getConnectorPublicKey(data.connectorUrl)
                const conInfo: Partial<ConnectorConfigInfo> = {
                  name: data.name,
                  privateUrl: data.connectorUrl,
                  authPublicKey: jwtToken,
                }
                connectorUrl = connectorUrl || data.connectorUrl
                createConnectorStartAction({ connectorConfig: conInfo })
              } catch (error) {
                enqueueMessage('connectors.failedToCreateConnector', 'error')
              }
            }}
            onCancel={navigateBack}
            submitButtonLabel={t('common.buttonAuthorize')}
          />
        </ContentAreaPanel>
      </ContentArea>
    </>
  )
}

export default ConnectorAdd
