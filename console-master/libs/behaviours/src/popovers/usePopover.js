import { useCallback, useState } from 'react'

const usePopover = () => {
  const [popoverAnchorEl, setAnchorEl] = useState(null)
  const [lastAnchorWidth, setLastAnchorWidth] = useState(0)

  const handlePopoverClick = useCallback(event => {
    setAnchorEl(event.currentTarget)
    setLastAnchorWidth(event.currentTarget.getBoundingClientRect().width)
  }, [])

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const popoverIsOpen = Boolean(popoverAnchorEl)

  return {
    popoverAnchorEl,
    handlePopoverClick,
    handlePopoverClose,
    popoverIsOpen,
    lastAnchorWidth,
  }
}

export default usePopover
