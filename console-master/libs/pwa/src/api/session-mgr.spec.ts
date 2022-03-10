/* eslint-disable @typescript-eslint/no-var-requires */
import JestFetchMock from 'jest-fetch-mock'
import type { RouteHandlerCallbackContext } from 'workbox-routing'

import { NoSessionState, TokenExpiredSessionState } from '../types/session-mgr'
import {
  getMockExpiredSession,
  getMockFailureSession,
  getMockInvalidSession,
  getMockLogout,
  getMockSuccessSession,
} from './__mocks__/session-mgr'

jest.mock('../workbox/index')
jest.mock('./venue-session')
jest.mock('./session-mgr-cache')

JestFetchMock.enableMocks()

type Mock = ReturnType<typeof jest.fn>

class BroadcastChannel {
  args: unknown[]
  constructor(...args) {
    this.args = args
  }
}
const createFetchEvent = (type: string, init: FetchEventInit) => {
  return Object.assign({ type }, init) as FetchEvent
}

describe('eid-session', () => {
  //const fetch = self.fetch as FetchMock
  let log, error

  beforeAll(async () => {
    ;({ log, error } = console)
    console.log = jest.fn()
    console.error = jest.fn()
    jest.resetModules()
    Object.assign(self, {
      origin: 'https://jest.cylance.com',
      BroadcastChannel,
      registration: {
        scope: 'https://protect.cylance.com/',
      },
    })
  })

  afterAll(() => {
    Object.assign(console, { log, error })
    jest.resetModules()
  })

  const loadWorkboxRoutes = async (): Promise<
    Record<string, Record<string, (ctx: RouteHandlerCallbackContext) => Promise<Response>>>
  > => {
    const { default: workbox } = await import('../workbox') // require('../workbox')
    await import('./session-mgr')

    const { restoreSessionFromStorage } = await import('./session-mgr-cache')
    // @ts-ignore
    restoreSessionFromStorage.mockImplementation(async () => {
      return new NoSessionState()
    })

    const RegisterRoute = workbox.routing.registerRoute as Mock
    return RegisterRoute.mock.calls.reduce((acc, [k, fn, method]) => {
      acc[k] = acc[k] || {}
      acc[k][method] = fn
      return acc
    }, {})
  }

  const createRequestContext = (input: RequestInfo, init?: RequestInit): RouteHandlerCallbackContext => {
    const request = new Request(input, init)
    return {
      url: new URL(self.origin + input),
      request,
      event: createFetchEvent('document', {
        request,
      }),
    }
  }

  it('is initially logged out', async () => {
    const routes = await loadWorkboxRoutes()

    const response = await routes['/uc/session/eid'].GET(createRequestContext('/uc/session/eid'))

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, loading: false })
  })

  it('is state changed to loading', async () => {
    const routes = await loadWorkboxRoutes()

    const response = await routes['/uc/session/eid'].GET(createRequestContext('/uc/session/eid'))

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, loading: true })
  })

  it('is able to update session state to active', async () => {
    const routes = await loadWorkboxRoutes()

    const mockResponse = getMockSuccessSession()
    const response = await routes['/uc/session/eid/success'].POST(
      createRequestContext('/uc/session/eid/success', {
        method: 'POST',
        body: JSON.stringify(mockResponse),
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        loggedIn: true,
        loading: false,
        accessToken: mockResponse.accessToken,
        accessTokenVenue: mockResponse.accessTokenVenue,
        idToken: mockResponse.idToken,
      }),
    )
  })

  it('is able to update session state to error', async () => {
    const routes = await loadWorkboxRoutes()

    const response = await routes['/uc/session/eid/failure'].POST(
      createRequestContext('/uc/session/eid/failure', {
        method: 'POST',
        body: JSON.stringify(getMockFailureSession()),
      }),
    )

    expect(response.status).toEqual(500)
    await expect(response.json()).resolves.toEqual({
      loggedIn: false,
      loading: false,
      error: expect.objectContaining({ status: 500 }),
    })
  })

  it('updates state to error if failes to parse token', async () => {
    const routes = await loadWorkboxRoutes()

    const mockResponse = getMockInvalidSession()
    const response = await routes['/uc/session/eid/success'].POST(
      createRequestContext('/uc/session/eid/success', {
        method: 'POST',
        body: JSON.stringify(mockResponse),
      }),
    )

    expect(response.status).toEqual(400)
    await expect(response.json()).resolves.toEqual({
      error: expect.objectContaining({}),
      loggedIn: false,
      loading: false,
    })
  })

  it('calculates returnUrl with idToken on logout', async () => {
    const routes = await loadWorkboxRoutes()

    const mockLoginResponse = getMockSuccessSession()
    const mockLogoutResponse = getMockLogout()
    await routes['/uc/session/eid/success'].POST(
      createRequestContext('/uc/session/eid/success', {
        method: 'POST',
        body: JSON.stringify(mockLoginResponse),
      }),
    )
    const response = await routes['/uc/session/eid/logout'].POST(
      createRequestContext('/uc/session/eid/logout', {
        method: 'POST',
        body: JSON.stringify(mockLogoutResponse),
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        returnUrl: mockLogoutResponse.returnUrl.replace('ID_TOKEN_HINT', mockLoginResponse.idToken),
      }),
    )
  })

  it('expired session triggers sso for first client, but not for subsequent', async () => {
    const routes = await loadWorkboxRoutes()

    const mockResponse = getMockExpiredSession()

    const { restoreSessionFromStorage } = await import('./session-mgr-cache')
    // @ts-ignore
    restoreSessionFromStorage.mockImplementation(async () => {
      return new TokenExpiredSessionState({ idToken: mockResponse.idToken, loggedIn: false, loading: false })
    })

    let sessionResponse = await routes['/uc/session/eid'].GET(createRequestContext('/uc/session/eid'))

    expect(sessionResponse.status).toEqual(200)
    await expect(sessionResponse.json()).resolves.toEqual({
      loggedIn: false,
      loading: false,
      idToken: mockResponse.idToken,
      trySso: true,
    })

    sessionResponse = await routes['/uc/session/eid'].GET(createRequestContext('/uc/session/eid'))

    expect(sessionResponse.status).toEqual(200)
    await expect(sessionResponse.json()).resolves.toEqual({
      loggedIn: false,
      loading: true,
    })
  })
})
