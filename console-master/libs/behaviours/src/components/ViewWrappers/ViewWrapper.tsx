import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, makeStyles } from '@material-ui/core'

import { useBISPolicySchema } from '@ues-data/bis'

import { usePageTitle } from '../../hooks'
import { PageTitlePanel } from '../../panels'
import type { ContentAreaPanelProps } from '../ContentAreaPanel'
import type { RoutedTabProps } from '../Tabs'
import { Tabs, useGetCurrentHelpLink, useRoutedTabsProps } from '../Tabs'
import { TabContentWrapper } from './TabContentWrapper'

export interface ViewWrapperProps {
  titleKey: string
  helpId?: string
  subtitleKey?: string
  fullHeight?: boolean
  fullHeightExceptions?: string[]
  fullWidthExceptions?: string[]
  tabs?: RoutedTabProps['tabs']
  tabWrapper?: boolean
  tabWrapperExceptions?: string[]
  tKeys?: string[]
  PanelProps?: Omit<ContentAreaPanelProps, 'fullWidth' | 'title'>
  basename?: string
}

interface StyleProps {
  fullHeight?: boolean
}

const useStyles = makeStyles(theme => ({
  outerContainer: ({ fullHeight }: StyleProps) => ({
    padding: theme.spacing(6),
    height: fullHeight ? '100%' : 'auto',
  }),
}))

export const ViewWrapper: React.FC<ViewWrapperProps> = memo(
  ({
    titleKey,
    subtitleKey,
    helpId = null,
    children,
    tabs = [],
    tabWrapper = false,
    tabWrapperExceptions,
    tKeys,
    PanelProps = {},
    basename,
    fullHeight,
    fullHeightExceptions = [],
    fullWidthExceptions = [],
  }) => {
    const { isMigratedToACL, isMigratedToDP } = useBISPolicySchema()
    const tabsProps = useRoutedTabsProps({ tabs, extraTenantFeatures: { isMigratedToACL, isMigratedToDP } })
    const { value, children: childrenTab } = tabsProps
    const disableFullHeight = fullHeightExceptions?.includes(value)
    const disableFullWidth = fullWidthExceptions?.includes(value)
    const classes = useStyles({ fullHeight: fullHeight && !disableFullHeight })
    const { t } = useTranslation(tKeys, { useSuspense: true })
    const currentHelpId = useGetCurrentHelpLink(tabs, basename) ?? helpId

    const title = t(titleKey)
    usePageTitle(title)

    const renderTabs = () => {
      return (
        <Tabs navigation fullScreen {...tabsProps}>
          {tabWrapper ? (
            <Box className={classes.outerContainer}>
              <TabContentWrapper
                value={value}
                tabs={tabs}
                tKeys={tKeys}
                exceptions={tabWrapperExceptions}
                fullWidth={!disableFullWidth}
                PanelProps={PanelProps}
              >
                {childrenTab}
              </TabContentWrapper>
            </Box>
          ) : (
            childrenTab
          )}
        </Tabs>
      )
    }

    return (
      <Box width={'100%'} height={'100%'} style={{ display: 'flex', flexDirection: 'column' }}>
        <PageTitlePanel title={[t('common.settings'), title]} subtitle={t(subtitleKey)} helpId={currentHelpId} />
        {tabs.length ? renderTabs() : children}
      </Box>
    )
  },
)
