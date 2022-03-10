import { useCallback, useState } from 'react'
import { matchPath, useNavigate } from 'react-router-dom'

import { ResponsiveDrawerMode, useResponsiveDrawerMode, useResponsiveDrawerState } from './ResponsiveDrawerProvider'

export type useResponsiveNestedListItemProps = {
  name: string
  path: string
  defaultLink?: string
}
export type ResponsiveNestedListItemProps = readonly [boolean, (ev: React.MouseEvent<HTMLElement>) => boolean]

export const useResponsiveNestedListItem = ({
  name,
  path,
  defaultLink,
}: useResponsiveNestedListItemProps): ResponsiveNestedListItemProps => {
  const mode = useResponsiveDrawerMode()
  const { open: openDrawer, isOpenSub, toggleSub } = useResponsiveDrawerState()
  const [openSubmenu, setOpenSubmenu] = useState(isOpenSub(name))
  const navigate = useNavigate()
  const handleClick = useCallback(
    event => {
      if (event.defaultPrevented) {
        return
      }
      event.defaultPrevented = true
      if (openDrawer) {
        toggleSub(name, !openSubmenu)
        setOpenSubmenu(openSubmenu => !openSubmenu)
      }

      if (defaultLink && !matchPath(window.location.pathname, path)) {
        navigate(defaultLink)
        return true
      }
    },
    [defaultLink, navigate, openDrawer, openSubmenu, path, toggleSub, name],
  )

  const open = (mode === ResponsiveDrawerMode.MODAL || openDrawer) && openSubmenu
  return [open, handleClick] as const
}
