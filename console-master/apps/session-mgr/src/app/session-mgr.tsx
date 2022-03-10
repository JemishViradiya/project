import React, { useCallback, useEffect, useState } from 'react'
import type { Workbox } from 'workbox-window'

import { resolveOverrideEnvironmentValue } from '@ues-data/shared'

import { handleLogin } from './login'
import { handleLogout } from './logout'
import { getMockOrigin, getMockSuccessEidSession } from './mock'
import type { SessionManagerResponse } from './types'
import { Mode, Phase, ServiceWorkerNotifyError } from './types'
import { SessionMgrView } from './view'

declare global {
  interface Window {
    workbox?: Workbox
    workboxReady: Promise<Workbox>
  }
}

const getPhase = (sessionManagerResponse: SessionManagerResponse) => {
  if (sessionManagerResponse.loginStatus !== undefined) return Phase.Login
  else if (sessionManagerResponse.logoutStatus !== undefined) return Phase.Logout
  else return Phase.Login
}

const handleMessage = (phase: Phase, returnUrl: string, mock: boolean) => {
  if ((phase === Phase.Login || phase === Phase.Logout) && returnUrl) {
    console.log('self.handleMessage:success')
    const nextUrl = returnUrl
    if (mock) {
      window.history.pushState(undefined, document.title, nextUrl)
    } else {
      window.location.href = nextUrl
    }
  } else {
    console.log('self.handleMessage:failure')
    // TODO: show error message
  }
}

export function SessionMgr() {
  const [errorMessage, setErrorMessage] = useState<string>()
  const [phase, setPhase] = useState<Phase>(Phase.Login)
  const mock: boolean = resolveOverrideEnvironmentValue('SESSION_MANAGER_MOCK').value === 'true'

  const notifyServiceWorker = useCallback(async () => {
    await window.workboxReady

    let sessionManagerResponse: SessionManagerResponse
    try {
      sessionManagerResponse = mock
        ? getMockSuccessEidSession()
        : JSON.parse(document.getElementById('response')?.textContent || '{}')
    } catch (error) {
      sessionManagerResponse = {
        statusCode: 0,
        statusMessage: 'client error',
        loginStatus: 'failure',
        message: 'Failed to parse response.',
      }
    }

    console.log('sessionManagerResponse', sessionManagerResponse)
    const openerOrigin = mock ? getMockOrigin() : document.getElementById('openerOrigin')?.textContent || ''

    const phase = getPhase(sessionManagerResponse)
    setPhase(phase)
    let swResponse: { mode: Mode; returnUrl?: string }
    try {
      switch (phase) {
        case Phase.Login:
          swResponse = await handleLogin(sessionManagerResponse)
          break
        case Phase.Logout:
          swResponse = await handleLogout(sessionManagerResponse)
          break
      }
    } catch (error) {
      console.error(error)
      sessionManagerResponse = error instanceof ServiceWorkerNotifyError ? error.errorState : { message: error.message }
      swResponse = error instanceof ServiceWorkerNotifyError ? error.errorState : error.message
    }

    if (sessionManagerResponse.statusCode !== 200) {
      const errMsg = sessionManagerResponse.message || sessionManagerResponse.statusMessage
      setErrorMessage(errMsg)
      console.error(errMsg)
    }

    if (swResponse.mode === Mode.Popup) {
      console.log('opener.postMessage')
      window.opener.postMessage(sessionManagerResponse, openerOrigin)
    } else if (swResponse.mode === Mode.Iframe) {
      console.log('parent.postMessage')
      window.parent.postMessage(sessionManagerResponse, window.origin)
    } else {
      console.log('self.handleMessage')
      handleMessage(phase, swResponse.returnUrl || sessionManagerResponse.returnUrl, mock)
    }
  }, [mock])

  useEffect(() => {
    notifyServiceWorker()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SessionMgrView showError={errorMessage !== undefined} phase={phase} />
}

export default SessionMgr
