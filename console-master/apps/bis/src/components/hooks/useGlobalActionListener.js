import { useEffect } from 'react'

// TODO: as UX / Product about 'drag', 'scroll' and 'wheel' here
const defaultEvents = ['click']

export default (isActive, handler, events = defaultEvents) =>
  useEffect(() => {
    if (isActive) {
      for (const [ev, options] of events) {
        document.addEventListener(ev, handler, options || {})
      }
      return () => {
        for (const [ev, options] of events) {
          document.removeEventListener(ev, handler, options || {})
        }
      }
    }
  }, [isActive, handler, events])
