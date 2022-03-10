import React, { memo, useCallback } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'

import { ErrorBoundary } from '../../shared'
import IpAddresses from './IpAddresses'
import { tab } from './static/ipAddressListType'

const IpAddressesContainer = memo(() => {
  const match = useMatch('/:section/:view/:ipAddressListTab')
  const navigate = useNavigate()

  const handleTabChange = useCallback(
    (_, ipAddressListTab) => {
      const path = `./${ipAddressListTab}`
      navigate(path)
    },
    [navigate],
  )

  return (
    <ErrorBoundary>
      <IpAddresses handleTabChange={handleTabChange} ipAddressListTab={match?.params?.ipAddressListTab ?? tab.TRUSTED} />
    </ErrorBoundary>
  )
})

IpAddressesContainer.displayName = 'IpAddressesContainer'

export default IpAddressesContainer
