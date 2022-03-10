import { PORTAL_URL, UES_ENV } from '@ues-data/network'

import { encodeRedirectUri } from '../network'

export { PORTAL_URL }

export const SessionStartUrl = (tenant?: string): string => {
  if (tenant) {
    return `/uc/launcher#/login?tenant=${tenant}&redirect_uri=${encodeRedirectUri()}}`
  }
  return `/uc/launcher#/select-tenant?redirect_uri=${encodeRedirectUri()}`
}

export const SessionLoginUrl = (tenant: string): string =>
  `/uc/session/launcher/login?type=ues&tenant=${tenant}&origin=${encodeURIComponent(
    window.location.origin,
  )}&redirect_uri=${encodeRedirectUri(true)}`

export const SessionLogoutUrl = (tenant?: string): string => {
  const tenantParam = tenant ? `&tenant=${tenant}` : ''
  return `/uc/session/launcher/logout?type=ues&origin=${encodeURIComponent(window.location.origin)}${tenantParam}`
}

export const LauncherPwaSessionUrl = '/uc/session/launcher/context'
