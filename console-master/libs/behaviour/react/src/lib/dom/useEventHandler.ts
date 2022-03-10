import { useCallback } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (event: React.SyntheticEvent, ...args: any) => boolean | void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEventHandler = (callback: Callback, deps: any[]): Callback => {
  return useCallback((event, ...args) => {
    if (event && event.preventDefault) {
      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (event.cancelable !== false && !event.defaultPrevented) {
        if (callback(event, ...args) !== false) {
          event.preventDefault()
        }
      }
    } else {
      callback(event, ...args)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
