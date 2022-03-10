import { isNil } from 'lodash-es'
import React, { Suspense, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PartialRouteObject, RouteObject } from 'react-router'
import { matchRoutes, useLocation } from 'react-router'

import { Tab } from '@material-ui/core'

import type { NavigateProps } from '@ues-behaviour/react'
import { useStatefulOutlet } from '@ues-behaviour/react'
import type { FeatureName, IsFeatureEnabled } from '@ues-data/shared'
import { useFeatures } from '@ues-data/shared'

import type { UesTabsProps } from './Tabs'

type DefaultTranslations = Record<string, string>

interface ExtraTenantFeatures {
  isMigratedToDP?: boolean
  isMigratedToACL?: boolean
}

interface RoutedTab<Translations = DefaultTranslations> {
  disabled?: boolean
  hidden?: boolean
  translations: Translations & { label: string }
  path: string
  features?: (isFeatureEnabled: IsFeatureEnabled, extraTenantFeatures?: ExtraTenantFeatures) => boolean
  helpId?: string
}

export type TabRouteObject<Translations = DefaultTranslations> = Omit<PartialRouteObject, 'path'> & RoutedTab<Translations>

export interface RoutedTabProps {
  tabs: RoutedTab[]
  navigateProps?: NavigateProps
  extraTenantFeatures?: ExtraTenantFeatures
}

const filterTabs = (
  tabs: RoutedTab[],
  isFeatureEnabled: (key: FeatureName) => boolean,
  extraTenantFeatures?: ExtraTenantFeatures,
) => tabs.filter(tab => !tab.hidden && (!tab.features || tab.features(isFeatureEnabled, extraTenantFeatures)))

export const useRoutedTabsProps = ({
  tabs,
  navigateProps,
  extraTenantFeatures,
}: RoutedTabProps): Pick<UesTabsProps, 'value' | 'onChange' | 'children' | 'tabs'> => {
  const { t } = useTranslation([])
  const { isEnabled } = useFeatures()

  const [route, setRoute, outlet] = useStatefulOutlet(navigateProps)

  const filteredItems = useMemo(() => {
    return filterTabs(tabs, isEnabled, extraTenantFeatures).map((tab, index) => (
      <Tab key={index} value={tab.path} label={t(tab.translations?.label)} disabled={tab.disabled} />
    ))
  }, [tabs, isEnabled, extraTenantFeatures, t])

  const value = route || '/'
  const onChange: UesTabsProps['onChange'] = useCallback(
    (event: React.ChangeEvent | React.FormEvent, value = '/') => {
      setRoute(value)
    },
    [setRoute],
  )

  return {
    value,
    onChange,
    tabs: filteredItems,
    children: <Suspense fallback={null}>{outlet}</Suspense>,
  }
}

export const useGetCurrentHelpLink = (childRoutes: RoutedTabProps['tabs'], basename?: string) => {
  const location = useLocation()

  return useMemo(() => {
    const matches = matchRoutes((childRoutes as unknown) as RouteObject[], location.pathname, basename ?? '')?.reverse()
    const lastMatch = matches?.find(route => {
      return !isNil(((route.route as unknown) as TabRouteObject)?.helpId)
    })
    return ((lastMatch?.route as unknown) as TabRouteObject)?.helpId
  }, [location, childRoutes, basename])
}
