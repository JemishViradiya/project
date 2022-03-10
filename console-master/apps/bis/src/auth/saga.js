import { observeStore, store } from '../ReduxSetup'
import {
  BackgroundAuthenticate,
  BackgroundAuthenticateFailure,
  BackgroundAuthenticateSuccess,
  BackgroundCheck,
  FailAuthentication,
} from './state'
import { REFRESH_BUFFER } from './token'

window.addEventListener('message', ({ data }) => {
  const type = data && data.type
  if (type) {
    const { type: _, ...props } = data
    if (type === 'TokenRenewSuccess') {
      console.warn('TokenRenewSuccess', data)
      store.dispatch(BackgroundAuthenticateSuccess(props))
    } else if (type === 'TokenRenewFailure') {
      console.warn('TokenRenewFailure', data)
      store.dispatch(BackgroundAuthenticateFailure(props))
    } else if (type === 'LoginFailure') {
      store.dispatch(FailAuthentication({ error: type, ...data }))
    }
  }
})

/** Expiration Timer
 * reset the timer whenever the expiry changes
 * trigger BackgroundAuthenticate() when expiring
 * trigger BackgroundCheck() when expired
 */
let expiryTimeout
observeStore(
  store,
  ({ auth: { expiry } }) => expiry,
  expiry => {
    if (expiryTimeout) {
      clearTimeout(expiryTimeout)
      expiryTimeout = undefined
    }
    if (expiry) {
      const delta = expiry - REFRESH_BUFFER - Date.now()
      if (delta > 0) {
        console.warn('TokenExpiryTimeout', delta)
        expiryTimeout = setTimeout(() => {
          const pending = expiry - Date.now()
          if (pending > 0) {
            // ensure we terminate backend calls when pending is due
            expiryTimeout = setTimeout(() => {
              expiryTimeout = undefined
              console.warn('TokenExpiredTimeout NOW')
              store.dispatch(BackgroundCheck())
            }, pending)
          } else {
            expiryTimeout = undefined
          }
          console.warn('TokenExpiryTimeout NOW')
          store.dispatch(BackgroundAuthenticate())
        }, delta)
      }
    }
  },
)

/** Headless auth timeout
 *
 */
let headlessTimeout
observeStore(
  store,
  ({ auth: { headless } }) => headless === 'sso' || headless === 'refresh',
  headless => {
    if (headlessTimeout) {
      clearTimeout(headlessTimeout)
      headlessTimeout = undefined
    }
    if (headless) {
      console.warn('HeadlessExpiryTimeout', REFRESH_BUFFER)
      headlessTimeout = setTimeout(() => {
        headlessTimeout = undefined
        store.dispatch(BackgroundAuthenticateFailure({ tenant: store.getState().auth.tenant }))
      }, REFRESH_BUFFER)
    }
  },
)
