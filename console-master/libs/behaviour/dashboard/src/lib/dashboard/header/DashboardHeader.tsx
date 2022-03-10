/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReactNode } from 'react'
import React, { memo, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core'

import { ResponsiveDrawerMode, useResponsiveDrawerMode } from '@ues-behaviour/nav-drawer'
import { useIntersectionObserver } from '@ues-behaviour/react'
import { isNewDashboard, isOutOfBoxDashboard } from '@ues-data/dashboard-config'
import { FeatureName, useFeatures } from '@ues-data/shared'
import type { UesTheme } from '@ues/assets'
import { HelpLinks } from '@ues/assets'
import { PageTitlePanel } from '@ues/behaviours'

import { selectDashboardId, selectTitle } from '../store'

export interface HeaderProps {
  widgetDrawerOpen: boolean
  children?: ReactNode
}

const useStyles = makeStyles<UesTheme, { mode: ResponsiveDrawerMode; isSticky: boolean }>(theme => ({
  appBar: {
    backgroundColor: theme.palette.background.body,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1.75),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    flex: '0 0 auto',
    width: '100%',
    // TODO: Do we need this in the PageTitle ?
    paddingLeft: ({ mode }) => (mode === ResponsiveDrawerMode.MODAL ? 48 + theme.spacing(2) : 0),
    transition: theme.transitions.create('box-shadow', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
  },
  sentinel: {
    visibility: 'hidden',
    height: theme.spacing(2.25),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}))

export const DashboardHeader = memo(({ children }: HeaderProps) => {
  const { t } = useTranslation(['dashboard', 'navigation'])
  const features = useFeatures()
  const cronosEnabled = features.isEnabled(FeatureName.UESCronosNavigation)

  const mode = useResponsiveDrawerMode()
  const sentinelRef = useRef<HTMLDivElement>()
  const isSticky = useIntersectionObserver(sentinelRef)
  const styles = useStyles({ mode, isSticky })
  const dashboardTitle = useSelector(selectTitle)
  const dashboardId = useSelector(selectDashboardId)
  const title = Array.isArray(dashboardTitle) ? dashboardTitle[0] : dashboardTitle
  const cronosTitle = isOutOfBoxDashboard(dashboardId, title)
    ? t(`navigation:${dashboardId}`)
    : isNewDashboard(title)
    ? t(`navigation:${title}`)
    : title
  const helpLink = cronosEnabled ? HelpLinks.CronosDashboard : HelpLinks.Dashboard

  return useMemo(() => {
    const pageTitle = cronosEnabled ? [t('pageTitle'), cronosTitle] : dashboardTitle
    return (
      <>
        <div className={styles.sentinel} ref={sentinelRef} />
        <PageTitlePanel title={pageTitle} actions={children} helpId={helpLink} />
      </>
    )
  }, [children, cronosEnabled, cronosTitle, dashboardTitle, helpLink, styles.sentinel, t])
})
