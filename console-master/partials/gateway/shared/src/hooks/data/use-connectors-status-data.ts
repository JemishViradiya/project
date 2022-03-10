//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import { useEffect, useState } from 'react'

import type { ConnectorConfigInfo, TenantHealth } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import { useMock, useUesSession } from '@ues-data/shared'

import type { Task } from '../../utils'

export interface ConnectorStatus {
  connectorIds?: string[]
  connectors?: Partial<ConnectorConfigInfo>[]
  enrolledConnectors?: Partial<ConnectorConfigInfo>[]
  health?: TenantHealth | `${TenantHealth}`
}

type UseConnectorsStatusDataFn = () => Task<ConnectorStatus>

export const useConnectorsStatusData: UseConnectorsStatusDataFn = () => {
  const [data, setData] = useState<ConnectorStatus>({})
  const [loading, setLoading] = useState<boolean>(false)

  const isMock = useMock()
  const { tenantId } = useUesSession()

  useEffect(() => {
    if (isEmpty(data)) {
      fetchConnectorsStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const fetchConnectorsStatus = async () => {
    const api = isMock === true ? GatewayApiMock : GatewayApi

    try {
      setLoading(true)
      const [connectors, health] = await Promise.all([api.Connectors.read(tenantId), api.Tenants.readHealth(tenantId)])

      const { connectorIds, enrolledConnectors } = (connectors.data as Partial<ConnectorConfigInfo>[]).reduce(
        (acc, connector) => ({
          connectorIds: [...acc.connectorIds, connector.connectorId],
          enrolledConnectors: connector.enrolled?.value ? [...acc.enrolledConnectors, connector] : [...acc.enrolledConnectors],
        }),
        { connectorIds: [], enrolledConnectors: [] },
      )

      setData({
        connectorIds,
        enrolledConnectors,
        connectors: connectors.data as Partial<ConnectorConfigInfo>[],
        health: health.data.health,
      })
    } catch (error) {
      throw new Error(error?.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading }
}
