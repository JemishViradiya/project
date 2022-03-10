import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'

import { AddressLookupQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

const AddressLookupProvider = memo(({ defaultValue, location }) => {
  const { loading, data = {} } = useStatefulApolloQuery(AddressLookupQuery, { variables: location })
  return useMemo(() => {
    if (loading) return ''
    if (!data.geocode || data.geocode.length === 0) {
      return defaultValue || ''
    }
    return data.geocode
  }, [data.geocode, defaultValue, loading])
})

AddressLookupProvider.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
  defaultValue: PropTypes.string,
}

export default AddressLookupProvider
