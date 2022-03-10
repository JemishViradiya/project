import { NoSessionState } from '../../types/session-mgr'
import { mockToken as venueMockToken } from './venue-session'
import { mockToken } from './vtx-session'

const jwtEncodeMock = (tokenPayload: any) => {
  const header = btoa(
    JSON.stringify({
      alg: 'RS256',
      typ: 'JWT',
    }),
  )
  const payload = btoa(JSON.stringify(tokenPayload))
  return `${header}.${payload}`
}

const idTokenMock = jwtEncodeMock({
  sub: 'Auz+ERc0CF3MUPzKaJ8g9FI=',
  tenant: 'l29072771',
  nonce: 'n4XPBobKmdAnk75cYvvNlg==',
  sid: '7aeaa3df-e5f5-4de4-821f-50effa046cbb',
  aud: '7a8c8a54-dfe7-4814-a879-a9031e74e7ed',
  exp: 1637860960,
  iat: 1637853760,
  iss: 'https://idp-dev.eval.blackberry.com/op',
})

export const getMockSuccessSession = () => ({
  statusCode: 200,
  loginStatus: 'success',
  message: 'SignIn success',
  accessToken: mockToken,
  accessTokenVenue: jwtEncodeMock(venueMockToken),
  idToken: idTokenMock,
})

export const getMockExpiredSession = () => {
  const expiredToken = { ...venueMockToken, exp: Date.now() / 1000 - 1 }
  return {
    statusCode: 200,
    loginStatus: 'success',
    message: 'SignIn success',
    accessToken: mockToken,
    accessTokenVenue: jwtEncodeMock(expiredToken),
    idToken: idTokenMock,
  }
}

export const getMockInvalidSession = () => ({
  statusCode: 200,
  loginStatus: 'success',
  message: 'SignIn success',
  accessToken: 'invalid',
  accessTokenVenue: jwtEncodeMock(venueMockToken),
  idToken: idTokenMock,
})

export const getMockLogout = () => ({
  statusCode: 200,
  logoutStatus: 'success',
  returnUrl:
    'https://idp-dev.eval.blackberry.com/op/session/end?post_logout_redirect_uri=https%3A%2F%2Fr00-ues.cylance.com%3A4200%2FLogin&id_token_hint=ID_TOKEN_HINT',
})

export const getMockFailureSession = () => ({
  statusCode: 500,
  loginStatus: 'failure',
  message: 'Failed to sign in user. Please try again',
  statusMessage: 'Error message',
})
