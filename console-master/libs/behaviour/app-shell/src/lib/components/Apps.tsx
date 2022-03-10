import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { NavigationApps } from '@ues-behaviour/nav-drawer'
import { getUpdateApps, queryApps } from '@ues-data/nav'
import { useStatefulReduxQuery } from '@ues-data/shared'

type NavigationAppsProps = React.ComponentProps<typeof NavigationApps>

export const useNavigationApps = ({ mock }: { mock?: undefined | unknown[] }): NavigationAppsProps => {
  let navigation = []
  let userNavigation
  const updateApps = useSelector(getUpdateApps)

  const { loading, data: apps, refetch } = useStatefulReduxQuery(queryApps, {})

  useEffect(() => {
    if (updateApps) {
      refetch({ refetch: true })
    }
  }, [refetch, updateApps])

  if (loading) return { userNavigation, navigation }

  try {
    navigation = apps['navigation']
    userNavigation = apps['userNavigation']
  } catch (error) {
    if (mock) {
      navigation = mock
    } else {
      throw error
    }
  }
  return { userNavigation, navigation }
}

export const Apps = React.memo((props: Parameters<typeof useNavigationApps>[0]) => <NavigationApps {...useNavigationApps(props)} />)

Apps.displayName = 'Apps'
