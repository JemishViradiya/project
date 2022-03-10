/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import { List } from '@material-ui/core'

import { isNewDashboard, isOutOfBoxDashboard } from '@ues-data/dashboard-config'
import { FeatureName, useFeatures } from '@ues-data/shared'

import { NESTED_LIST_ITEM_HEIGHT, ResponsiveDrawerMode, useResponsiveDrawerMode } from '../responsiveDrawer'
import ListItemLink from './ListItemLink'
import ListItemsPopover, { useListItemPopover } from './ListItemsPopover'

export type NavRouteProps = {
  name: string
  route: string
  match?: string
}

export type NavListItemProps = {
  navigation?: NavRouteProps[]
  route: string
  match?: string
  icon: unknown
  name: string
}

export type ResponsiveNavListItemProps = readonly [
  {
    icon: unknown
    name: string
    onMouseOver: (event: unknown) => void
    onMouseLeave: (event: unknown) => void
    children: React.ReactNode
    nestedRoutes?: NavRouteProps[]
    route?: string
    openPop: boolean
  },
  React.ReactNode,
]

// Dashboard menu titles are customizable and will not be translated
function dashboardName(features, t, route, name) {
  if (route && typeof name != 'undefined' && name && features.isEnabled(FeatureName.UESCronosNavigation)) {
    const isDashboardRoute = features.isEnabled(FeatureName.SingleNXApp)
      ? route.includes('console#/dashboard')
      : route.includes('dashboard#/dashboard')
    if (isDashboardRoute) {
      const dashboardId = route.substr(route.lastIndexOf('/') + 1, route.length)
      if (dashboardId) {
        if (isOutOfBoxDashboard(dashboardId, name)) {
          return t(dashboardId)
        } else if (isNewDashboard(name)) {
          return t(name)
        }
      }
      return name
    } else if (
      features.isEnabled(FeatureName.SingleNXApp)
        ? route.includes('console#/static/')
        : route.includes('dashboard#/static') || route.includes('info#/dashboard')
    ) {
      return name
    }
  }
}

export const useNavListItem = ({
  navigation,
  route,
  match,
  icon,
  name,
  ...otherProps
}: NavListItemProps): ResponsiveNavListItemProps => {
  const [anchorEl, openPop, openPopoverMenu, handleClose, handleOpen] = useListItemPopover()
  const nestedRoutes = navigation || null
  const mode = useResponsiveDrawerMode()
  const { t } = useTranslation(['navigation'])
  const itemProps = navigation ? { route, nestedRoutes } : { route, match }
  const nestedListHeight = navigation ? navigation.length * NESTED_LIST_ITEM_HEIGHT : 0
  const features = useFeatures()

  const getChildren = () => {
    return (
      navigation && (
        <List disablePadding>
          {navigation.map(({ name, ...props }) => {
            return (
              <ListItemLink
                key={name}
                name={dashboardName(features, t, props.route, name) || t(name)}
                openPop
                handleClose={handleClose}
                nested={mode === ResponsiveDrawerMode.INLINE}
                {...props}
              />
            )
          })}
        </List>
      )
    )
  }

  const popover = (
    <ListItemsPopover
      name={t(name)}
      icon={icon}
      handleClose={handleClose}
      openPop={openPop}
      anchorEl={anchorEl}
      route={route}
      defaultRoute={route}
      match={match}
      handleOpen={handleOpen}
      nestedListHeight={nestedListHeight}
    >
      {getChildren()}
    </ListItemsPopover>
  )

  return [
    {
      icon,
      name: t(name),
      openPop,
      onMouseOver: openPopoverMenu,
      onMouseLeave: handleClose,
      children: getChildren(),
      ...itemProps,
      ...otherProps,
    },
    popover,
  ] as const
}
