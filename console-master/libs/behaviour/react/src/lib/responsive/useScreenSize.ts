import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

import { useMediaQuery, useTheme } from '@material-ui/core'
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

const USE_MEDIA_QUERY_OPTIONS = Object.freeze({ noSsr: true })

export const useScreenBreakpoint = (offsetX = 0): Breakpoint | number => {
  const theme = useTheme()
  const keys = useMemo(() => [...theme.breakpoints.keys].reverse(), [theme])
  return (
    keys.reduce((output, key) => {
      const breakpointValue = theme.breakpoints.values[key]
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(breakpointValue + offsetX), USE_MEDIA_QUERY_OPTIONS)
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}

declare type GetSizeType = { width: number; height: number }

export function useScreenSize<T = GetSizeType>(
  selectSize: (window: Window, previousValue?: T) => T,
  opts?: boolean | AddEventListenerOptions,
): T {
  const [ScreenSize, setScreenSize] = useState(() => selectSize(window))
  const update = setScreenSize // useMemo(() => debounce(setScreenSize, 120, { leading: true, trailing: true, maxWait: 300 }), [])

  const onResize = useCallback(
    function onResize(ev?: UIEvent) {
      update(currentSize => {
        return selectSize(window, currentSize)
      })
    },
    [selectSize, update],
  )

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize, opts)
    return () => {
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onResize])

  return ScreenSize
}
