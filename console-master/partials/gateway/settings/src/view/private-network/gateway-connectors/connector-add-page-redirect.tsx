import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { Types, Utils } from '@ues-gateway/shared'

const { Page, GatewayRouteParamName } = Types
const { makePageRoute } = Utils

const GatewayConnectorAddPageRedirect: React.FC = () => {
  const [searchParams] = useSearchParams()

  const connectorUrl = searchParams.get(GatewayRouteParamName.ConnectorUrl)

  return <Navigate to={makePageRoute(Page.GatewaySettingsConnectorAdd, { queryStringParams: { connectorUrl } })} />
}

export default GatewayConnectorAddPageRedirect
