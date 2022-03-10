/* eslint-disable sonarjs/cognitive-complexity */
import * as React from 'react'

import { GLOBAL_OVERRIDE } from '../../lib/mockContext'
import type { AbstractUesSession, BaseQuery, UesSessionProviderData } from '../types'

interface BroadcastChannelProps<Data extends AbstractUesSession> {
  query: BaseQuery<Data>
  name: string
  ref?: React.MutableRefObject<UesSessionProviderData<Data>>
  preload?: boolean
  matchUrls?: Set<string>
}

const logStateChange = (setState: React.Dispatch<React.SetStateAction<UesSessionProviderData<any>>>, fnOrObject) => {
  const isFn = typeof fnOrObject === 'function'
  return setState(state => {
    const nextState = isFn ? fnOrObject(state) : fnOrObject
    const { loading, data, error } = nextState || {}
    console.log('console:session setState', { loading, data, error })
    return nextState
  })
}

const noMatchedUrls = new Set<string>()
export const makeBroadcastChannel = <Data extends AbstractUesSession>({
  query,
  name,
  ref = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    current: {},
  },
  preload = false,
  matchUrls = noMatchedUrls,
}: BroadcastChannelProps<Data>) => {
  const fetchFn = async (mock = false, refresh = false) => {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    return query[mock ? 'mockQueryFn' : 'query']({ refresh })
  }
  let initialFetch = preload ? fetchFn(GLOBAL_OVERRIDE) : undefined

  return (mock: boolean): UesSessionProviderData<Data> => {
    const [state, setState] = React.useState<UesSessionProviderData<Data>>(() => ref.current)

    const mounted = React.useRef<boolean>(false)
    const firstLoad = React.useRef<Promise<void>>()
    if (!firstLoad.current && initialFetch) {
      const waitFor = initialFetch
      initialFetch = undefined
      firstLoad.current = (async () => {
        let firstLoadState
        try {
          const data = await waitFor
          firstLoadState = { loading: false, future: Promise.resolve(), data }
        } catch (error) {
          firstLoadState = { loading: false, future: Promise.reject(error), error }
        } finally {
          if (mounted.current) logStateChange(setState, state => (state.data ? state : (ref.current = firstLoadState)))
        }
      })()
    }

    React.useEffect(() => {
      mounted.current = true
      return () => {
        mounted.current = false
      }
    }, [])

    // https://developers.google.com/web/updates/2016/09/broadcastchannel
    React.useEffect(() => {
      const fetchData = async (refresh = false) => {
        try {
          const data = await fetchFn(mock, refresh)
          logStateChange(setState, ({ future }) => (ref.current = { loading: false, future, data, fetchData }))
        } catch (error) {
          logStateChange(setState, ({ future }) => (ref.current = { loading: false, future, error, fetchData }))
        }
      }
      fetchData(false)
      if (mock) return

      const messageHandler = async event => {
        if (event.origin !== globalThis.origin) return

        // Optional: ensure the message came from workbox-broadcast-update
        if (event.data.meta === 'workbox-broadcast-update') {
          const {
            data: { channel, type },
          } = event
          if (channel === name && type === 'SESSION_UPDATED') {
            const { cacheName, payload } = event.data
            if (cacheName === 'session') {
              if (payload) {
                const data = JSON.parse(payload) as Data
                logStateChange(setState, state => {
                  if (state.data?.key === data.key && state.data.tokenExpirationTime === data.tokenExpirationTime) {
                    return state
                  }
                  const { future } = state
                  return (ref.current = { loading: false, future, data, fetchData })
                })
                console.log(' BroadcastChannel', name, 'session-updated:', data)
              } else {
                console.error('error')
              }
              return
            }
          } else if (event.data.type === 'LOCAL_SESSION_RESET') {
            window.location.reload()
          }
        }
      }

      let channel: BroadcastChannel
      try {
        channel = new BroadcastChannel(name)
      } catch (error) {
        console.warn('No BroadcastChannel Support !!', error.message)
      }

      if (channel) {
        channel.onmessage = messageHandler
        channel.onmessageerror = function (e) {
          console.error(e)
        }
        return () => channel.close()
      } else {
        globalThis.navigator.serviceWorker.addEventListener('message', messageHandler)
        return () => globalThis.navigator.serviceWorker.removeEventListener('message', messageHandler)
      }
    }, [mock])

    return state
  }
}
