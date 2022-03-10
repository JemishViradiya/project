/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import PropTypes from 'prop-types'
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useMediaQuery, useTheme } from '@material-ui/core'

import { getDashboardNavIds } from '@ues-data/nav'
import type { ReduxQuery } from '@ues-data/shared'
import { FeatureName, NoPermissions, useFeatures, useMock, useStatefulReduxQuery } from '@ues-data/shared'
import { Loading, useSnackbar } from '@ues/behaviours'

import { initialize, initializeMock, selectError, selectIsInitialized } from './store'
import { ReduxSlice } from './store/types'
import type { DashboardLayoutHookProps, DashboardProps, DrilldownProps } from './types'
import { ErrorCode } from './types'

const DashboardLayoutContext = React.createContext({})

const USE_MEDIA_QUERY_OPTIONS = Object.freeze({ noSsr: true })

const DashboardLayoutProvider = ({ theme, children }) => {
  const isXS = useMediaQuery(theme.breakpoints.only('xs'), USE_MEDIA_QUERY_OPTIONS)
  const isSM = useMediaQuery(theme.breakpoints.only('sm'), USE_MEDIA_QUERY_OPTIONS)
  const isMD = useMediaQuery(theme.breakpoints.only('md'), USE_MEDIA_QUERY_OPTIONS)
  const isLG = useMediaQuery(theme.breakpoints.only('lg'), USE_MEDIA_QUERY_OPTIONS)

  const spacing = theme.spacing(2)
  const layoutProps = useMemo(() => {
    if (isXS) {
      return {
        breakpoint: 'xs',
        rowHeight: spacing * 3,
        margin: spacing * 2.5,
        padding: spacing * 4,
      }
    } else if (isSM) {
      return {
        breakpoint: 'sm',
        rowHeight: spacing * 3,
        margin: spacing * 2.5,
        padding: spacing * 4,
      }
    } else if (isMD) {
      return {
        breakpoint: 'md',
        rowHeight: spacing * 4,
        margin: spacing * 2.5,
        padding: spacing * 4,
      }
    } else if (isLG) {
      return {
        breakpoint: 'lg',
        rowHeight: spacing * 4,
        margin: spacing * 2.5,
        padding: spacing * 4,
      }
    } else {
      return {
        breakpoint: 'xl',
        rowHeight: spacing * 4,
        margin: spacing * 2.5,
        padding: spacing * 4,
      }
    }
  }, [isLG, isMD, isSM, isXS, spacing])

  return <DashboardLayoutContext.Provider value={layoutProps}>{children}</DashboardLayoutContext.Provider>
}

DashboardLayoutProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.node,
}

DashboardLayoutProvider.displayName = 'DashboardLayoutProvider'

export const useDashboardLayout = (): DashboardLayoutHookProps => useContext(DashboardLayoutContext)

type DroppingItem = { i: 'droppingItem'; w: number; h: number }
export interface DashboardWidgetsContext {
  addWidgetsDrawerOpen: boolean
  setAddWidgetsDrawerOpen: Dispatch<SetStateAction<boolean>>
  droppingItem: DroppingItem
  setDroppingItem: Dispatch<SetStateAction<DroppingItem>>
  drillDownOpen: boolean
  setDrillDownOpen: Dispatch<SetStateAction<boolean>>
  drillDownContext: DrilldownProps
  setDrillDownContext: Dispatch<SetStateAction<DrilldownProps>>
  dashboardCount: number
}
// eslint-disable-next-line no-redeclare
const DashboardWidgetsContext = React.createContext<DashboardWidgetsContext>({
  addWidgetsDrawerOpen: false,
  setAddWidgetsDrawerOpen: boolean => undefined,
  droppingItem: { i: 'droppingItem', w: 1, h: 1 },
  setDroppingItem: unknown => undefined,
  drillDownOpen: false,
  setDrillDownOpen: boolean => undefined,
  drillDownContext: null,
  setDrillDownContext: DrilldownProps => undefined,
  dashboardCount: 0,
})

const DashboardWidgetsProvider = memo(({ children }) => {
  const [dashboardCount, setDashboardCount] = useState(0)
  const [drillDownOpen, setDrillDownOpen] = useState(false)
  const [drillDownContext, setDrillDownContext] = useState(null)
  const [addWidgetsDrawerOpen, setAddWidgetsDrawerOpen] = useState(false)
  const [droppingItem, setDroppingItem] = useState<DroppingItem>({
    i: 'droppingItem',
    w: 1,
    h: 1,
  })

  const features = useFeatures()
  const nxAppEnabled = features.isEnabled(FeatureName.SingleNXApp)
  const mock = useMock()
  const ROUTE_PREFIX = nxAppEnabled ? 'console#/dashboard/' : 'dashboard#/dashboard/'

  const dashboardNavIds = useSelector(getDashboardNavIds(ROUTE_PREFIX))

  useEffect(() => {
    if (dashboardNavIds) setDashboardCount(dashboardNavIds.length)
  }, [dashboardNavIds])

  return useMemo(() => {
    if (!mock && !dashboardNavIds) return null

    return (
      <DashboardWidgetsContext.Provider
        value={{
          addWidgetsDrawerOpen,
          setAddWidgetsDrawerOpen,
          droppingItem,
          setDroppingItem,
          drillDownOpen,
          setDrillDownOpen,
          drillDownContext,
          setDrillDownContext,
          dashboardCount,
        }}
      >
        {children}
      </DashboardWidgetsContext.Provider>
    )
  }, [addWidgetsDrawerOpen, children, dashboardCount, dashboardNavIds, drillDownContext, drillDownOpen, droppingItem, mock])
})

DashboardWidgetsProvider.displayName = 'DashboardWidgetProvider'

export const useDashboardWidgets = (): DashboardWidgetsContext => useContext(DashboardWidgetsContext)

export type DashboardProviderProps = {
  children: ReactNode
  dashboardProps: DashboardProps
}

const query: ReduxQuery<boolean, DashboardProps> = {
  query: dashboardProps => (dashboardProps.nonPersistent ? initializeMock(dashboardProps) : initialize(dashboardProps)),
  mockQuery: dashboardProps => initializeMock(dashboardProps),
  selector: (props: DashboardProps) => state => ({ data: selectIsInitialized(state, props), error: selectError(state, props) }),
  slice: ReduxSlice,
  permissions: NoPermissions,
}

export const DashboardProvider: FC<DashboardProviderProps> = memo(({ dashboardProps, children }) => {
  const theme = useTheme()
  const { t } = useTranslation(['dashboard'])

  const queryProps = { editable: true, ...dashboardProps }
  const { data: isMounted, error } = useStatefulReduxQuery(query, { variables: queryProps })
  const snackbar = useSnackbar()

  useEffect(() => {
    if (!isMounted && error && error.message === ErrorCode.DASHBOARD_NOT_FOUND) {
      snackbar.enqueueMessage(t('dashboardNotFound'), 'error')
    }
  }, [error, isMounted, snackbar, t])

  return useMemo(() => {
    if (!isMounted) {
      return <Loading />
    }
    return (
      <DashboardWidgetsProvider>
        <DashboardLayoutProvider theme={theme}>{children}</DashboardLayoutProvider>
      </DashboardWidgetsProvider>
    )
  }, [children, isMounted, theme])
})

DashboardProvider.displayName = 'DashboardProvider'
