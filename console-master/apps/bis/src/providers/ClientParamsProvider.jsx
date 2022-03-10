import PropTypes from 'prop-types'
import React, { useRef } from 'react'

import { f11n } from '@ues-bis/standalone-shared'
import { ClientParamsQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

import useTenant from '../components/hooks/useTenant'
import { environment } from '../environments/environment'

const LOCAL_STORAGE_KEY = 'clientParams'
const query = ClientParamsQuery(window.MOCK_GOOGLE_API_KEY || environment.map.mockedApiKey)

const formatData = data => {
  const features = {}
  ;(data.clientParams.features || []).forEach(({ key, value, type }) => {
    if (type === 'number') {
      features[key] = parseFloat(value)
    } else if (type === 'boolean') {
      features[key] = value === 'true'
    } else {
      features[key] = value
    }
  })
  return {
    loading: false,
    value: {
      ...data.clientParams,
      features,
    },
  }
}

const ClientParamsProvider = ({ children }) => {
  const { tenant } = useTenant()
  const cachedData = useRef()
  if (!cachedData.current) {
    try {
      cachedData.current = {
        loading: false,
        value: JSON.parse(localStorage.getItem(`${tenant}.${LOCAL_STORAGE_KEY}`) || '{}'),
      }
    } catch (_) {
      cachedData.current = undefined
    }
  }

  const { loading, error, data } = useStatefulApolloSubscription(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  if (error) {
    console.log('Error fetching client parameters:', error)
  } else if (!loading) {
    cachedData.current = formatData(data)
    localStorage.setItem(`${tenant}.${LOCAL_STORAGE_KEY}`, JSON.stringify(cachedData.current.value))
  }

  return <f11n.Context.Provider value={cachedData.current}>{children}</f11n.Context.Provider>
}

ClientParamsProvider.displayName = 'ClientParamsProvider'
ClientParamsProvider.propTypes = {
  children: PropTypes.node,
}

export default ClientParamsProvider
