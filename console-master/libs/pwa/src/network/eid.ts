import { UES_ENV } from './ues'

export enum EID_URLS {
  STAGING = 'https://idp-rel.eval.blackberry.com',
  DEV = 'https://idp-dev.eval.blackberry.com',
  PRODUCTION = 'https://idp.blackberry.com',
}

export const EID_URL = EID_URLS[UES_ENV]
