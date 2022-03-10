import { useCallback, useLayoutEffect, useState } from 'react'

import type { ResizeObserver } from '@juggle/resize-observer'

import { getSize } from './utils/size'

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver
  }
}

const factory = (onResize, subject) => {
  const resizeObserver = new window.ResizeObserver(onResize)
  resizeObserver.observe(subject)
  return resizeObserver
}

declare type GetSizeType = { width: number; height: number }

export function useComponentSize<T = GetSizeType>(
  ref: React.RefObject<HTMLElement>,
  selectSize: (element: HTMLElement, previousValue?: T) => T,
): T {
  const [ComponentSize, setComponentSize] = useState(() => selectSize(ref.current))
  selectSize = selectSize || ((getSize as unknown) as typeof selectSize)

  const onResize = useCallback(
    function onResize() {
      setComponentSize(currentSize => {
        if (ref.current) {
          return selectSize(ref.current, currentSize)
        }
        return currentSize
      })
    },
    [ref, selectSize, setComponentSize],
  )

  const current = ref.current
  useLayoutEffect(() => {
    // Ensure we have the right one for disconnection in case
    // ref.current changes between observe and disconnect, and
    // to pickup the current ref when we are mounted
    const currentRef = ref.current
    if (!currentRef) {
      return
    }

    onResize()

    let resizeObserver = factory(onResize, currentRef)

    return () => {
      if (resizeObserver) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resizeObserver.disconnect(currentRef)
        resizeObserver = null
      }
    }
  }, [onResize, ref, current])

  return ComponentSize
}
