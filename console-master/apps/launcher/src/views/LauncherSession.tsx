import type { FormEvent } from 'react'
import React, { useCallback, useEffect } from 'react'

import { Button, TextField } from '@material-ui/core'

import type { UesSessionProviderProps } from '@ues-data/shared'
import { LauncherSessionApi } from '@ues-data/shared'

import { SetReplacer } from '../utils/format'

const LauncherSessionState = () => {
  const state = LauncherSessionApi.useSessionState()

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const elements = event.currentTarget.elements
    const tenantId = (elements.namedItem('select-a-tenant') as HTMLInputElement).value
    const url = LauncherSessionApi.SessionApi.SessionLoginUrl(tenantId)
    window.location.href = url
  }, [])

  return (
    <div style={{ maxWidth: 'calc(100% - 54px)', padding: '1rem', flexGrow: 1 }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', maxWidth: 240, float: 'right' }}>
        <TextField
          id="select-a-tenant"
          label="TenantId"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          autoComplete="on"
          type="text"
          required
          fullWidth
          style={{ margin: '0 1rem 0 0' }}
        />
        <Button variant="contained" color={state.data?.loggedIn ? 'secondary' : 'primary'} disabled={state.loading} type="submit">
          Login
        </Button>
      </form>
      <pre>{JSON.stringify(state, SetReplacer, 4)}</pre>
    </div>
  )
}

const Logout: React.FC<{ tenantParam?: string; loading?: React.ReactNode }> = ({ tenantParam, loading }) => {
  useEffect(() => {
    window.location.href = LauncherSessionApi.SessionApi.SessionLogoutUrl(tenantParam)
  })
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{loading}</>
}

const LauncherSession = ({ action, ...props }: UesSessionProviderProps & { tenantParam?: string; action?: 'logout' }) => {
  if (action === 'logout') {
    return <Logout {...props} />
  }
  return (
    <LauncherSessionApi.SessionProvider {...props}>
      <LauncherSessionState />
    </LauncherSessionApi.SessionProvider>
  )
}

export default LauncherSession
