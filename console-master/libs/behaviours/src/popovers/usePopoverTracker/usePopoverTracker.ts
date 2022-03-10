import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef } from 'react'

import type { PopoverTrackerHookProps } from './types'

// --NOTE: ideally we'd only track `height`, but it appears not every `transitionstart` is raised
//         when multiple animations are fired at the same time
const TRACKABLE_TRANSITIONS = ['height', 'opacity']

function usePopoverTracker({ anchorEl, paperId, updateTimeFrequency = 10 }: PopoverTrackerHookProps) {
  const popover = useRef<any | null>(null)
  const updatePositionIntervalsRef = useRef({})

  const updatePopoverPosition = throttle(
    useCallback(() => {
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect()
        const nextTop = `${rect.bottom}px`
        const prevTop = popover.current?.style.top

        popover.current = document.querySelector(`#${paperId}`)

        if (popover.current && prevTop !== nextTop) {
          popover.current.style.top = nextTop
        }
      }
    }, [anchorEl, paperId]),
    updateTimeFrequency,
    { leading: true, trailing: true },
  )

  const stopUpdates = useCallback(
    (event?: TransitionEvent) => {
      if (event && updatePositionIntervalsRef.current[event.propertyName]) {
        updatePopoverPosition()
        clearInterval(updatePositionIntervalsRef.current[event.propertyName])
        updatePositionIntervalsRef.current[event.propertyName] = null
      }

      if (!event) {
        Object.keys(updatePositionIntervalsRef.current).forEach(propertyName => {
          clearInterval(updatePositionIntervalsRef.current[propertyName])
          updatePositionIntervalsRef.current[propertyName] = null
        })
      }
    },
    [updatePopoverPosition, updatePositionIntervalsRef],
  )

  const handleStart = useCallback(
    (event: TransitionEvent) => {
      if (
        anchorEl &&
        !updatePositionIntervalsRef.current[event.propertyName] &&
        TRACKABLE_TRANSITIONS.includes(event.propertyName)
      ) {
        updatePositionIntervalsRef.current[event.propertyName] = setInterval(updatePopoverPosition, updateTimeFrequency)
      }
    },
    [anchorEl, updatePopoverPosition, updatePositionIntervalsRef, updateTimeFrequency],
  )

  const handleEnd = useCallback(
    (event: TransitionEvent) => {
      if (TRACKABLE_TRANSITIONS.includes(event.propertyName)) {
        updatePopoverPosition()
        stopUpdates(event)
      }
    },
    [stopUpdates, updatePopoverPosition],
  )

  useEffect(() => {
    document.addEventListener('transitionstart', handleStart)
    document.addEventListener('transitioncancel', handleEnd)
    document.addEventListener('transitionend', handleEnd)

    return () => {
      document.removeEventListener('transitionstart', handleStart)
      document.removeEventListener('transitioncancel', handleEnd)
      document.removeEventListener('transitionend', handleEnd)
      stopUpdates()
    }
  }, [handleStart, handleEnd, stopUpdates])
}

export default usePopoverTracker
