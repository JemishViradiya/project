import React, { useCallback, useState } from 'react'

import { Button } from '@material-ui/core'

import type { UesSessionProviderProps } from '@ues-data/shared'
import { resolveOverrideEnvironmentValue, SessionMgrApi } from '@ues-data/shared'

import { SetReplacer } from '../utils/format'

const SmgrSessionState = () => {
  const state = SessionMgrApi.useSessionState()
  const mock = resolveOverrideEnvironmentValue('SESSION_MANAGER_MOCK').value

  const onLogin = useCallback(() => {
    if (mock) {
      const url = window.location.href.replace(/uc\/launcher.*/i, 'uc/session-mgr')
      window.open(url, 'login-complete', 'popup')
    } else {
      const url = SessionMgrApi.SessionApi.SessionStartUrl()
      window.location.href = url
    }
  }, [mock])

  const onLogout = useCallback(() => {
    const url = SessionMgrApi.SessionApi.SessionLogoutUrl()
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
  <SessionMgrApi.SessionProvider {...props}>
    <SmgrSessionState />
  </SessionMgrApi.SessionProvider>
)

export default UesSession
