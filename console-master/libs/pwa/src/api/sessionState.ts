import type { RouteHandlerCallbackContext } from 'workbox-routing'

export const loginStateStorage = {
  state: null,
  capture: (searchParams: URLSearchParams): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const entries = searchParams.entries()
    loginStateStorage.state = Array.from(entries).reduce((agg, [k, v]) => {
      agg[k] = v
      return agg
    }, {})
  },
  consume: (context: RouteHandlerCallbackContext & { event?: { loginState?: Record<string, string> } }): Record<string, string> => {
    if (loginStateStorage.state) {
      context.event.loginState = loginStateStorage.state
      loginStateStorage.state = null
    }
    return context.event.loginState
  },
}
