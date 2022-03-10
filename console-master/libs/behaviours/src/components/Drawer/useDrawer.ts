import { useCallback, useRef, useState } from 'react'

import type { onDrawerClose, ToggleDrawer } from './types'

export const useDrawer = (onClose?: onDrawerClose) => {
  const [open, setOpen] = useState(false)
  const excludeToggleElRef = useRef(null)

  const toggleDrawer: ToggleDrawer = useCallback(
    element => {
      excludeToggleElRef.current = element
      setOpen(prev => {
        if (prev) {
          onClose && onClose()
        }
        return !prev
      })
    },
    [onClose],
  )

  const onClickAway = useCallback(
    event => {
      if (open && excludeToggleElRef.current && !excludeToggleElRef.current.contains(event.target)) {
        toggleDrawer()
      }
    },
    [open, toggleDrawer],
  )

  return { open, toggleDrawer, onClickAway }
}
