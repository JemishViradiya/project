import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'

import Tab from '@material-ui/core/Tab'

import { Container, ErrorBoundary, LayoutHeader as Header, Tabs } from '../../shared'
import BlacklistedIpAddress from './components/BlacklistedIpAddress'
import WhitelistedIpAddress from './components/WhitelistedIpAddress'
import styles from './ipAddresses.module.less'
import { tab } from './static/ipAddressListType'

const IpAddresses = memo(({ handleTabChange, ipAddressListTab = tab.TRUSTED }) => {
  const { t } = useTranslation()
  return (
    <ErrorBoundary>
      <div className={styles.pageContainer}>
        <Header title={t('settings.ipAddress.title')} />
        <Container className={styles.tabContainer}>
          <Tabs value={ipAddressListTab} onChange={handleTabChange}>
            <Tab classes={{ root: styles.tabRoot }} label={t('settings.ipAddress.trustedLabel')} value={tab.TRUSTED} />
            <Tab classes={{ root: styles.tabRoot }} label={t('settings.ipAddress.untrustedLabel')} value={tab.UNTRUSTED} />
          </Tabs>

          <Routes>
            <Route path={`${tab.TRUSTED}`} element={<WhitelistedIpAddress />} />
            <Route path={`${tab.UNTRUSTED}`} element={<BlacklistedIpAddress />} />
            <Route path={'/*'} element={<Navigate to={`${tab.TRUSTED}`} />} />
          </Routes>
        </Container>
      </div>
    </ErrorBoundary>
  )
})

IpAddresses.displayName = 'IpAddresses'

IpAddresses.propTypes = {
  handleTabChange: PropTypes.func.isRequired,
  ipAddressListTab: PropTypes.string.isRequired,
}

export default IpAddresses
