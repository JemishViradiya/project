import { Permission } from '@ues-data/shared-types'

export const getMockSuccessEidSession = () => ({
  statusCode: 200,
  loginStatus: 'success',
  message: 'SignIn success',
  accessToken: jwtEncodeMock(mockToken()),
  venueAccessToken: jwtEncodeMock(venueMockToken()),
})

export const getMockOrigin = () => window.opener.location.href

const jwtEncodeMock = (tokenPayload: any) => {
  const header = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
  const payload = btoa(JSON.stringify(tokenPayload))
  return `${header}.${payload}`
}

const venueMockToken = () => ({
  tenantid: 'c301bb46-c80e-4b7b-9653-ca3535ed2eea',
  userlogin: 'demo@ahem.sw.rim.net',
  userid: '26a36fec-1d0a-4fde-a06f-d6eb1db2cc18',
  ghostusername: null,
  tenantdefaultstype: 0,
  shardid: 1,
  scp: [],
  eecoid: 'AsJ75TK6SeSi3/XMZcpcoew=',
  role: [{ name: 'administrator', isCustom: false, zoneids: [], rbac: {} }],
  jti: '839e52ae-def7-4c8d-bf48-c7501b73a0f0',
  iat: Date.now() / 1000,
  nbf: 1620868863,
  exp: Date.now() / 1000 + 60 * 60,
  iss: 'cylance.com',
})

const mockToken = () => ({
  tenant: 'l29072771',
  roles: ['Administrator'],
  entitlements: Object.entries(Permission).map(p => p[1]),
  jti: 'hTXnx3Hh4wphcw31Z8HLc',
  sub: 'AsJ75TK6SeSi3/XMZcpcoew=',
  iss: 'https://idp-rel.eval.blackberry.com/op',
  iat: Date.now() / 1000,
  exp: Date.now() / 1000 + 60 * 60,
  scope: 'mockScope',
  aud: [
    'https://staging.cs.labs.blackberry.com',
    'https://release.big.labs.blackberry.com',
    'https://stg.mtd.labs.blackberry.com',
    'https://idp-rel.eval.blackberry.com/api',
    'resource://com.blackberry.bis.stg/portal',
    'https://api-stg.dlp.labs.blackberry.com',
  ],
  azp: 'b1a7c32e-2129-4074-a206-2ada6dad8103',
  client_id: 'b1a7c32e-2129-4074-a206-2ada6dad8103',
})
