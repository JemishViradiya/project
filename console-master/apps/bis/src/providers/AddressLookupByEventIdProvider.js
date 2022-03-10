import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'

import { AddressLookupByEventIdQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

const AddressLookupByEventIdProvider = memo(({ defaultValue, eventId }) => {
  const { loading, data = {} } = useStatefulApolloQuery(AddressLookupByEventIdQuery, { variables: { id: eventId } })
  return useMemo(() => {
    if (loading) return ''
    if (!data.eventLocation || data.eventLocation.length === 0) {
      return defaultValue || ''
    }
    return data.eventLocation
  }, [data.eventLocation, defaultValue, loading])
})

AddressLookupByEventIdProvider.propTypes = {
  defaultValue: PropTypes.string,
  eventId: PropTypes.string.isRequired,
}

export default AddressLookupByEventIdProvider
