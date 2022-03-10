import { UES_ENV } from './ues'

enum PORTAL_URLS {
  STAGING = 'https://portal-itl.cs.labs.blackberry.com',
  DEV = 'https://portal-dev.cs.labs.blackberry.com',
  PRODUCTION = 'https://portal.cs.blackberry.com',
}

export const PORTAL_URL = PORTAL_URLS[UES_ENV]
