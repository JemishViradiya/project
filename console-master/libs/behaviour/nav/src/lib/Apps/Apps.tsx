import React from 'react'

import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import {
  BasicHelp as Help,
  BasicHelp as PrototypeIcon,
  BrandOptics,
  BrandPersona,
  BrandProtect,
  CylanceIconAssets,
  CylanceIconDashboard,
  CylanceIconGateway,
  CylanceIconReports,
  CylanceIconSettings,
  CylanceIconZones,
  NavAlerts,
  NavAvert,
  NavEvents,
  NavProfilePolicy,
  NavUsers,
} from '@ues/assets'

import ListItemLink from './ListItemLink'
import ListItemNested from './ListItemNested'
import type { NavListItemProps } from './useNavListItem'
import { useNavListItem } from './useNavListItem'
import { UserAccountComponent } from './UserAccountComponent'

const Icons = {
  prototype: PrototypeIcon,
  dashboards: CylanceIconDashboard,
  dashboard: CylanceIconDashboard,
  gateway: CylanceIconGateway,
  protectZones: CylanceIconZones,
  fallback: Help,
  alerts: NavAlerts,
  policies: NavProfilePolicy,
  assets: CylanceIconAssets,
  protection: BrandProtect,
  persona: BrandPersona,
  optics: BrandOptics,
  reporting: CylanceIconReports,
  settings: CylanceIconSettings,
  users: NavUsers,
  events: NavEvents,
  avert: NavAvert,
}

const fallback = (
  <List>
    <ListItem component="div">
      <ListItemIcon>
        <Skeleton animation="wave" variant="circle" width={26} height={26} />
      </ListItemIcon>
      <ListItemText primary={<Skeleton animation="wave" height="1rem" width="80%" />} />
    </ListItem>
  </List>
)

const NavListComponent = React.memo((props: NavListItemProps) => {
  const Component = props.navigation ? ListItemNested : ListItemLink
  const [itemProps, popover] = useNavListItem({
    icon: Icons[props.name] || Icons.fallback,
    ...props,
  })

  return (
    <>
      <Component {...itemProps} />
      {popover}
    </>
  )
})

type NavigationAppsProps = {
  userNavigation: NavListItemProps
  navigation: NavListItemProps[]
  UserInfo?: React.ReactNode
  signOutLink?: string
}

export const NavigationApps = React.memo(({ userNavigation, navigation, UserInfo, signOutLink }: NavigationAppsProps) => (
  <React.Suspense fallback={fallback}>
    <List disablePadding>
      {userNavigation && (
        <>
          <UserAccountComponent
            key="myAccount"
            nav={userNavigation}
            UserInfo={React.isValidElement(UserInfo) ? () => UserInfo : undefined}
            signOutLink={signOutLink}
          />
          <Divider key="divider" />
        </>
      )}
      {navigation.map(({ ...props }, index) => {
        return <NavListComponent key={props.name} {...props} />
      })}
    </List>
  </React.Suspense>
))
