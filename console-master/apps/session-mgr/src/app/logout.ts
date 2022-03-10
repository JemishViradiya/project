import { SessionMgrApi } from '@ues-data/shared'

import { Mode, ServiceWorkerNotifyError } from './types'

export const handleLogout = async sessionManagerResponse => {
  const target = '/uc/session/eid/logout'
  const response = await fetch(target, { method: 'POST', body: JSON.stringify(sessionManagerResponse) })
  const body = await response.json()
  const returnUrl = body.returnUrl === '' ? SessionMgrApi.SessionApi.SessionStartUrl() : body.returnUrl
  if (!response.ok)
    throw new ServiceWorkerNotifyError(response.statusText || `StatusCode: ${response.status}`, {
      statusCode: 0,
      statusMessage: 'client error',
      logoutStatus: 'failure',
      message: response.statusText,
      mode: Mode.Window,
    })
  return { ...body, returnUrl, mode: Mode.Window }
}
