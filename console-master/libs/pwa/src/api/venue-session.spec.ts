/* eslint-disable @typescript-eslint/no-var-requires */
import type { FetchMock } from 'jest-fetch-mock'
import JestFetchMock from 'jest-fetch-mock'
import type { RouteHandlerCallbackContext } from 'workbox-routing'

import { mockSession } from './__mocks__/venue-session'

jest.mock('../workbox/index')
// jest.mock('./venue-session')

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

describe('vtx-session', () => {
  const fetch = self.fetch as FetchMock
  const mockToken = mockSession.current.accessTokenVenue
  const s = mockToken.split('.')
  const expiredToken = [s[0], mockSession.current.token, s[2]].join('.')
  const mockVerificationToken = mockSession.current.verificationTokenVenue

  let log, error, warn

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runAllTimers()
  })

  beforeAll(async () => {
    ;({ log, error, warn } = console)
    console.log = jest.fn()
    console.error = jest.fn()
    console.warn = jest.fn()
    jest.resetModules()
    Object.assign(self, {
      origin: 'https://jest.cylance.com',
      BroadcastChannel,
      registration: {
        scope: 'https://protect.cylance.com/',
      },
    })

    require('../env')
  })

  afterAll(() => {
    Object.assign(console, { log, error, warn })
    jest.resetModules()
  })

  const loadWorkboxRoutes = async (): Promise<
    Record<string, Record<string, (ctx: RouteHandlerCallbackContext) => Promise<Response>>>
  > => {
    const { default: workbox } = await import('../workbox') // require('../workbox')
    await import('./venue-session')

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

    fetch.mockResponse(JSON.stringify({}))

    const response = await routes['/uc/session/venue'].GET(
      createRequestContext('/uc/session/venue', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, error: expect.objectContaining({}) })
  })

  it('is able to login with a session', async () => {
    const routes = await loadWorkboxRoutes()

    fetch
      .mockOnce(
        `abc
      var antiForgeryToken = "${mockVerificationToken}";
    def`,
      )
      .mockOnce(`"${mockToken}"`)

    const response = await routes['/uc/session/venue'].GET(createRequestContext('/uc/session/venue', {}))

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ loggedIn: true }))
  })

  it('fails with an expired session', async () => {
    const routes = await loadWorkboxRoutes()

    fetch
      .mockOnce(
        `abc
      var antiForgeryToken = "${mockVerificationToken}";
    def`,
      )
      .mockOnce(`"${expiredToken}"`)

    const response = await routes['/uc/session/venue'].GET(createRequestContext('/uc/session/venue', {}))

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, error: expect.objectContaining({}) })
  })

  it('fails with an invalid token', async () => {
    const routes = await loadWorkboxRoutes()

    fetch.mockResponse(JSON.stringify({ token: '123' }))

    const response = await routes['/uc/session/venue'].GET(
      createRequestContext('/uc/session/venue', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, error: expect.objectContaining({}) })
  })

  it('fails with an invalid response code', async () => {
    const routes = await loadWorkboxRoutes()

    fetch.mockResponse('unauthorized', { status: 401 })

    const response = await routes['/uc/session/venue'].GET(
      createRequestContext('/uc/session/venue', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ loggedIn: false, error: expect.objectContaining({}) })
  })
})
