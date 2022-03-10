import React from 'react'

const ssoFailureBody = JSON.stringify({
  statusCode: 400,
  statusMessage: 'sso failure',
  loginStatus: 'failure',
})

export const openSsoIframe = (idToken: string, onSsoFailure: () => void) => {
  const ssoLogin = window.location.origin + `/uc/session/sso?id_token_hint=${idToken}`

  const handleMessage = (event: MessageEvent) => {
    if (event.data.loginStatus === 'failure') {
      onSsoFailure()
    }
    window.removeEventListener('message', handleMessage)
  }

  window.addEventListener('message', handleMessage)

  const handleIframeError = () => {
    fetch('/uc/session/eid/failure', { method: 'POST', body: ssoFailureBody })
    onSsoFailure()
  }

  // Workaround for cases when iframe fails to load. onError is not invoked for iframe
  const onload = event => {
    if (event.target?.contentDocument?.title === 'Error') {
      handleIframeError()
    }
  }

  return (
    <iframe
      title="SSO"
      className="hidden"
      id="sessionMgrSSo"
      src={ssoLogin}
      width="0"
      height="0"
      hidden={true}
      aria-hidden
      onLoad={onload}
      onError={handleIframeError}
    />
  )
}
