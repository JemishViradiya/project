import { Mode, ServiceWorkerNotifyError } from './types'

const mode = (() => {
  if (window.opener && !window.menubar.visible) {
    // MenuBar is not visible in popups
    return Mode.Popup
  } else if (window.parent !== window) {
    return Mode.Iframe
  } else {
    return Mode.Window
  }
})()

export const handleLogin = async sessionManagerResponse => {
  const target = sessionManagerResponse.statusCode === 200 ? '/uc/session/eid/success' : '/uc/session/eid/failure'
  const response = await fetch(target, { method: 'POST', body: JSON.stringify(sessionManagerResponse) })
  const body = await response.json()
  if (sessionManagerResponse.statusCode === 200 && !response.ok)
    throw new ServiceWorkerNotifyError(response.statusText || `StatusCode: ${response.status}`, {
      statusCode: 0,
      statusMessage: 'client error',
      loginStatus: 'failure',
      message: response.statusText,
      mode,
    })
  return { ...body, mode }
}
