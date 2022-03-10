/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useState } from 'react'

export type ActionMenuProps = {
  open: boolean
  toggleOpen: () => void
  handleListKeyDown: (any) => void
  setOpen: (boolean) => void
}

export const useActionMenu = (): ActionMenuProps => {
  const [open, setOpen] = useState(false)

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  const toggleOpen = () => {
    setOpen(!open)
  }

  return {
    open: open,
    setOpen: setOpen,
    toggleOpen: toggleOpen,
    handleListKeyDown: handleListKeyDown,
  }
}
