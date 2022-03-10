import type { PopoverProps } from '@material-ui/core'

export interface DropdownProps {
  popover: {
    popoverAnchorEl: PopoverProps['anchorEl']
    handlePopoverClick: (event: unknown) => void
    handlePopoverClose: () => void
    popoverIsOpen: boolean
    lastAnchorWidth: number
  }
  trigger: React.ReactNode
  options: React.ReactNode[]
}
