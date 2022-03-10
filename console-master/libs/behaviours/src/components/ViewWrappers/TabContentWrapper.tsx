import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import type { ContentAreaPanelProps } from '../ContentAreaPanel'
import { ContentAreaPanel } from '../ContentAreaPanel'
import type { RoutedTabProps } from '../Tabs'

export const TabContentWrapper: React.FC<{
  value: string
  tabs: RoutedTabProps['tabs']
  tKeys?: string[]
  fullWidth?: boolean
  exceptions?: string[]
  PanelProps?: Omit<ContentAreaPanelProps, 'fullWidth' | 'title'>
}> = memo(({ value, tabs, children, tKeys, fullWidth, exceptions = [], PanelProps = {} }) => {
  const { t } = useTranslation(tKeys)
  const tab = tabs.find(tab => tab.path === value)

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!tab || exceptions.includes(value)) return <>{children}</>

  const {
    translations: { title, description },
  } = tab

  return (
    <ContentAreaPanel fullWidth={fullWidth} title={t(title)} {...PanelProps}>
      {description && <Typography>{t(description)}</Typography>}
      {children}
    </ContentAreaPanel>
  )
})
