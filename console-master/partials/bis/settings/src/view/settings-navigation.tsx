import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, makeStyles } from '@material-ui/core'

import { PageTitlePanel, Tabs, useRoutedTabsProps } from '@ues/behaviours'

import { bisRootTabs as Routes } from './index'

const useStyles = makeStyles(() => {
  return {
    container: {
      width: '100%',
      flexDirection: 'column',
      display: 'flex',
      height: '100%',
    },
  }
})

export const AdaptiveResponseNavigation = () => {
  const { t } = useTranslation('navigation')
  const styles = useStyles()
  const tabsProps = useRoutedTabsProps({ tabs: Routes })
  return (
    <Box className={styles.container}>
      <PageTitlePanel title={[t('settings'), t('personaForMobile')]} />
      <Tabs fullScreen navigation {...tabsProps} style={{ marginBottom: 0 }}>
        {tabsProps.children}
      </Tabs>
    </Box>
  )
}

export default AdaptiveResponseNavigation
