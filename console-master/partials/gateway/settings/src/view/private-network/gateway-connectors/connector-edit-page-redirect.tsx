import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { Types, Utils } from '@ues-gateway/shared'

const { Page } = Types
const { makePageRoute } = Utils

const GatewayConnectorEditPageRedirect: React.FC = () => {
  const { id } = useParams()

  return <Navigate to={makePageRoute(Page.GatewaySettingsConnectorEdit, { params: { id } })} />
}

export default GatewayConnectorEditPageRedirect
