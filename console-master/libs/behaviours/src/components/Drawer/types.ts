import type { ReactElement } from 'react'

type DrawerSize = 'small' | 'medium'

type DrawerBackground = 'white' | 'grey'

export type ToggleDrawer = (excludeToggleEl?: Element) => void

export interface DrawerAction {
  value?: string
  icon?: ReactElement
  onClick: () => void
}

export type onDrawerClose = () => void

export interface DrawerProps {
  title: string
  open: boolean
  size?: DrawerSize
  background?: DrawerBackground
  actions?: DrawerAction[]
  toggleDrawer: ToggleDrawer
  onClickAway: (event?: any) => void
}

export type ActionsMenuProps = Pick<DrawerProps, 'actions'>

export type DrawerStyleProps = Pick<DrawerProps, 'size' | 'background'>
