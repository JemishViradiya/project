import PropTypes from 'prop-types'
import React, { createContext, useMemo } from 'react'

import { IpAddressListQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

export const Context = createContext([])

export const IpAddressListProvider = ({ children, variables = {} }) => {
  const { loading, error, data = {} } = useStatefulApolloQuery(IpAddressListQuery, {
    variables,
    skip: !variables.id,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  const listData = useMemo(() => ({ loading, error, data: data.getIpAddressList }), [data, error, loading])

  return <Context.Provider value={listData}>{children}</Context.Provider>
}

IpAddressListProvider.propTypes = {
  children: PropTypes.node,
  variables: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
}

IpAddressListProvider.Consumer = Context.Consumer

export default IpAddressListProvider
