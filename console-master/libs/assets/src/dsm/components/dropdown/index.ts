// import { Fade } from '@material-ui/core'

import type { PopoverOrigin } from '@material-ui/core'

const dropdownMenuProps = {
  // TransitionComponent: Fade,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  } as PopoverOrigin,
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  } as PopoverOrigin,
  marginThreshold: 0,
}

const spacedDropdownMenuProps = {
  ...dropdownMenuProps,
  transformOrigin: {
    vertical: -4,
    horizontal: 'left',
  } as PopoverOrigin,
}

interface DropdownMenuProps {
  anOrHorizontal?: string | number
  trOrHorizontal?: string | number
}

const getCustomizableDropdownMenuProps = ({ anOrHorizontal, trOrHorizontal }: DropdownMenuProps) => ({
  // TransitionComponent: Fade,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: anOrHorizontal || 'left',
  } as PopoverOrigin,
  transformOrigin: {
    vertical: 'top',
    horizontal: trOrHorizontal || 'left',
  } as PopoverOrigin,
  marginThreshold: 0,
})

export { dropdownMenuProps, spacedDropdownMenuProps, getCustomizableDropdownMenuProps }
