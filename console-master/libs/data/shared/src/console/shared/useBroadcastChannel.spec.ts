/* eslint-disable @typescript-eslint/ban-ts-comment */
import { act, cleanup, renderHook } from '@testing-library/react-hooks'

import { makeBroadcastChannel } from './useBroadcastChannel'

describe('useBroadcastChannel', () => {
  const query = {
    url: '/mock/url/',
    query: jest.fn().mockResolvedValue({
      session: true,
    }),
    mockQueryFn: jest.fn().mockResolvedValue({
      mockedSession: true,
    }),
  }

  beforeEach(() => {
    // @ts-ignore
    globalThis.navigator.serviceWorker = new EventTarget()
    console.warn = Object.assign(jest.fn(), { original: console.warn })
  })
  afterEach(async () => {
    await cleanup()
    // @ts-ignore
    delete globalThis.navigator.serviceWorker
    // @ts-ignore
    console.warn = console.warn.original
  })

  describe('simple navigator interface', () => {
    const useBroadcastChannel = makeBroadcastChannel({
      name: 'app-channel',
      query,
    })

    it('renders', async () => {
      const { result } = renderHook(() => useBroadcastChannel(false))
      await act(async () => null)

      expect(result.current).toEqual(
        expect.objectContaining({
          data: {
            session: true,
          },
          future: undefined,
          loading: false,
        }),
      )
      expect(result.current.fetchData).toBeDefined()
    })
  })
})
