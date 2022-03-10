import React, { useCallback } from 'react'

import { Button } from '@material-ui/core'

import type { UesSessionProviderProps } from '@ues-data/shared'
import { VtxSessionApi } from '@ues-data/shared'

import { SetReplacer } from '../utils/format'

const VtxSessionState = () => {
  const state = VtxSessionApi.useSessionState()

  const onLogin = useCallback(() => {
    const url = VtxSessionApi.SessionApi.SessionStartUrl()
    window.location.href = url
  }, [])

  const onLogout = useCallback(() => {
    const url = VtxSessionApi.SessionApi.SessionLogoutUrl()
    window.location.href = url
  }, [])

  return (
    <div style={{ maxWidth: 'calc(100% - 54px)', padding: '1rem', flexGrow: 1 }}>
      <Button
        variant="contained"
        color={state.data?.loggedIn ? 'primary' : 'secondary'}
        disabled={state.loading}
        onClick={onLogin}
        style={{ float: 'right', marginLeft: 24 }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        color={state.data?.loggedIn ? 'secondary' : 'primary'}
        disabled={state.loading || !state.data?.loggedIn}
        onClick={onLogout}
        style={{ float: 'right' }}
      >
        Logout
      </Button>
      <pre>{JSON.stringify(state, SetReplacer, 4)}</pre>
    </div>
  )
}
const UesSession = (props: UesSessionProviderProps) => (
  <VtxSessionApi.SessionProvider {...props}>
    <VtxSessionState />
  </VtxSessionApi.SessionProvider>
)

export default UesSession
