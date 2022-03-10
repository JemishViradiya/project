import React, { useCallback } from 'react'

import { Button } from '@material-ui/core'

import type { UesSessionProviderProps } from '@ues-data/shared'
import { VenueSessionApi } from '@ues-data/shared'

import { SetReplacer } from '../utils/format'

const VenueSessionState = () => {
  const state = VenueSessionApi.useSessionState()

  const onLogin = useCallback(() => {
    const url = VenueSessionApi.SessionApi.SessionStartUrl()
    window.location.href = url
  }, [])

  const onLogout = useCallback(() => {
    const url = VenueSessionApi.SessionApi.SessionLogoutUrl()
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
const VenueSession = (props: UesSessionProviderProps) => (
  <VenueSessionApi.SessionProvider {...props}>
    <VenueSessionState />
  </VenueSessionApi.SessionProvider>
)

export default VenueSession
