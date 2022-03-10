import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import { EventListQuery } from '@ues-data/bis'

import useClientParams from '../components/hooks/useClientParams'
import ListProvider from './ListProvider'

export const EventListContext = createContext([])
const { Provider, Consumer } = EventListContext

export const useEventListContext = () => useContext(EventListContext)

const infiniteLoaderOpts = { key: 'eventInfiniteScroll', dataKey: 'events' /* batchSize: 50 */ }

const EventListProvider = ({ variables = {}, children }) => {
  const {
    privacyMode: { mode: privacyMode = true } = {},
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams() || {}
  const query = EventListQuery(privacyMode, RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection)

  return (
    <ListProvider query={query} provider={Provider} variables={variables} loaderOptions={infiniteLoaderOpts}>
      {children}
    </ListProvider>
  )
}

EventListProvider.propTypes = {
  variables: PropTypes.object,
  children: PropTypes.node.isRequired,
}

EventListProvider.Consumer = Consumer

export default EventListProvider
