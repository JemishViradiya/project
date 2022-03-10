//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AuthPublicKey } from '@ues-data/gateway'

const MOCK_CONNECTOR_URL = 'https://local.host'

export async function getConnectorPublicKey(connectorUrl: string): Promise<AuthPublicKey> {
  // TODO: This code is just for demonstration purposes. Delete this dummy key
  // in future.
  if (connectorUrl === MOCK_CONNECTOR_URL) {
    return {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    }
  }

  const response = await fetch(`${connectorUrl}/getJwtKey`, {
    method: 'POST',
    cache: 'no-cache',
    referrerPolicy: 'origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  if (response.status !== 200) {
    throw new Error(response.statusText)
  }

  return response.json()
}

export async function enrollConnector(
  connectorUrl: string,
  connectorId: string,
  serviceApiGatewayUrl: string,
  tenantId: string,
): Promise<void> {
  // TODO: This code is just for demonstration purposes. Delete this dummy key
  // in future.
  if (connectorUrl === MOCK_CONNECTOR_URL) {
    return
  }

  const response = await fetch(`${connectorUrl}/enroll`, {
    method: 'POST',
    cache: 'no-cache',
    referrerPolicy: 'origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connectorId: connectorId,
      tenantId: tenantId,
      regUrlPrefix: serviceApiGatewayUrl,
    }),
  })

  if (response.status !== 204) {
    throw new Error(response.statusText)
  }
}
