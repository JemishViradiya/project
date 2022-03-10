import { UES_LOGIN_DEPLOYMENT, UesLoginDeploymentHosting } from '@ues-data/network'

import { resolveOverrideEnvironmentValue } from '../../shared/overrideEnvironmentVariable'
import { encodeRedirectUri } from '../network'

const resolution = (() => {
  const value = resolveOverrideEnvironmentValue('UES_VENUE_LOGIN_FLOW').value
  if (value === 'option-a' || value === 'option-b') return value

  return 'option-a'
})()

export const SessionStartUrl = (): string => {
  /** 2 options here
   * a) goto login site
   * b) logout the user with SessionLogoutUrl
   *    - venue redirects through /?redirecturi=<original/url/path>
   *      /Account/Logoff -> 302: /?redirecturi=...
   *      /               -> 302: https://login.cylance.com/
   */

  if (resolution === 'option-a') {
    // option a)
    let origin = globalThis.origin
    if (UES_LOGIN_DEPLOYMENT === UesLoginDeploymentHosting.SELF) {
      origin = ''
    }
    return `${origin.replace(/protect|ues/g, 'login')}/Login?redirecturi=${encodeRedirectUri()}`
  } else {
    // option b)
    return SessionLogoutUrl()
  }
}

export const SessionLoginUrl = SessionStartUrl
export const SessionLogoutUrl = () => '/Account/Logoff'
export const VenueSessionUrl = '/uc/session/venue'
