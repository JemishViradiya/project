/* eslint-disable @typescript-eslint/no-var-requires */
import type { FetchMock } from 'jest-fetch-mock'
import JestFetchMock from 'jest-fetch-mock'
import type { RouteHandlerCallbackContext } from 'workbox-routing'

import { mockToken } from './__mocks__/vtx-session'
import { FETCH_FAILED } from './util'

jest.mock('../workbox/index')
jest.mock('./venue-session')

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

    require('../env')
  })

  afterAll(() => {
    Object.assign(console, { log, error })
    jest.resetModules()
  })

  const loadWorkboxRoutes = async (): Promise<
    Record<string, Record<string, (ctx: RouteHandlerCallbackContext) => Promise<Response>>>
  > => {
    const { default: workbox } = await import('../workbox') // require('../workbox')
    await import('./vtx-session')

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
    // fetch.once(JSON.stringify({ access_token: '12345' })).once(JSON.stringify({ name: 'naruto' }))

    const response = await routes['/uc/session/vtx'].GET(
      createRequestContext('/uc/session/vtx', {
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

    fetch.mockResponse(JSON.stringify({ token: mockToken }))

    const response = await routes['/uc/session/vtx'].GET(
      createRequestContext('/uc/session/vtx', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ loggedIn: true }))
  })

  it('fails with an invalid token', async () => {
    const routes = await loadWorkboxRoutes()

    fetch.mockResponse(JSON.stringify({ token: '123' }))

    const response = await routes['/uc/session/vtx'].GET(
      createRequestContext('/uc/session/vtx', {
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

    const response = await routes['/uc/session/vtx'].GET(
      createRequestContext('/uc/session/vtx', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({ error: { message: 'Token acquisition failed', status: 401 }, loggedIn: false })
  })

  it('fails with an invalid venue session', async () => {
    const routes = await loadWorkboxRoutes()
    const { acquireVenueSession, refreshVenueSession, mockSession } = (await import(
      './venue-session'
    )) as typeof import('./__mocks__/venue-session')

    acquireVenueSession.mockImplementation(async () => {
      return { ...mockSession, current: { ...mockSession.current, userId: null } }
    })
    refreshVenueSession.mockImplementation(async () => {
      return { ...mockSession, current: { ...mockSession.current, userId: null } }
    })

    fetch.mockResponse('unauthorized', { status: 401 })

    const response = await routes['/uc/session/vtx'].GET(
      createRequestContext('/uc/session/vtx', {
        headers: {
          authorization: 'Bearer token',
        },
      }),
    )

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual({
      error: { message: 'Venue user is not provisioned for ECS', status: 403 },
      loggedIn: false,
    })
  })

  it('uses a preloaded response', async () => {
    const routes = await loadWorkboxRoutes()

    fetch.mockResponse('{}', { status: 401 })

    const req = createRequestContext('/uc/session/vtx', {
      headers: {
        authorization: 'Bearer',
      },
    })

    Object.assign(req.event, {
      preloadResponse: Promise.resolve(new Response(JSON.stringify({ loggedIn: true }), { status: 200 })),
    })

    const response = await routes['/uc/session/vtx'].GET(req)

    expect(response.status).toEqual(200)
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ loggedIn: true }))
  })
})
