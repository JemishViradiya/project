import axios from 'axios'

import { useStandalone as isStandalone } from '@ues-bis/shared'

import { getAccessToken, getTenant } from './auth/state'
import { store } from './ReduxSetup'

const apiPort = process.env.NODE_ENV === 'production' ? window.location.port : '4000'

const standalone = isStandalone()

export const report = ({ message, ...rest }) => {
  if (!standalone) return

  const state = store.getState()
  const accessToken = getAccessToken(state)
  const tenant = getTenant(state)
  axios.post(
    `https://${window.location.hostname}:${apiPort}/${tenant}/stanley`,
    {
      message: message || 'Unknown error report',
      ...rest,
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
}
