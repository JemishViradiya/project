import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { IpAddressSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import { throwServerError } from '../components/util/errorHelper'

export const Context = createContext([])

export const IpAddressSettingsProvider = ({ children, variables = {} }) => {
  const { loading, error, data = {} } = useStatefulApolloQuery(IpAddressSettingsQuery, {
    variables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  if (error) {
    throwServerError(error)
  }

  const settings = useMemo(() => ({ loading, data: data.ipAddressSettings, total: data.ipAddressSettings?.length }), [
    data,
    loading,
  ])

  return <Context.Provider value={settings}>{children}</Context.Provider>
}

IpAddressSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  variables: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
    searchText: PropTypes.string,
  }).isRequired,
}

IpAddressSettingsProvider.Consumer = Context.Consumer

export default IpAddressSettingsProvider
