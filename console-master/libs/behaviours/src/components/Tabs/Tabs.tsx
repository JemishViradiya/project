//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import type { TabsProps, TabsTypeMap } from '@material-ui/core'
import { Box, Tabs as MuiTabs } from '@material-ui/core'

// eslint-disable-next-line @typescript-eslint/ban-types
export type UesTabsProps<T = {}> = TabsProps<
  TabsTypeMap['defaultComponent'],
  T & {
    tabs: React.ReactNode[]
    tabsTitle?: React.ReactNode
    fullScreen?: boolean
    navigation?: boolean
  }
>

const defaultItems: React.ReactNode = []

export const Tabs: React.FC<UesTabsProps> = ({
  tabs = defaultItems,
  tabsTitle,
  fullScreen,
  navigation = false,
  children,
  ...props
}) => {
  const { t } = useTranslation('components')
  const { orientation } = props

  const contentContainerProps = {
    width: fullScreen && '100%',
    height: fullScreen && '100%',
  }

  const tabsContainerProps = {
    horizontal: fullScreen ? { display: 'flex', flexDirection: 'column', height: '100%' } : { display: 'block' },
    vertical: { display: 'flex', flexDirection: 'row', height: fullScreen && '100%' },
  }

  const navigationClass = navigation ? { className: 'navigation' } : {}
  const tabPanelAriaLabel = t('components:tabPanel.ariaLabel', { name: props['aria-label'] || '' })
  return (
    <Box {...tabsContainerProps[orientation || 'horizontal']}>
      <Box>
        {orientation === 'vertical' && tabsTitle}
        <MuiTabs {...navigationClass} {...props}>
          {tabs}
        </MuiTabs>
      </Box>
      <Box ml={orientation === 'vertical' ? 6 : 0} {...contentContainerProps} role="tabpanel" aria-label={tabPanelAriaLabel}>
        {children}
      </Box>
    </Box>
  )
}
