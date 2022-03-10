import PropTypes from 'prop-types'
import React, { memo } from 'react'

import ClusterMapMarker from '../components/map/ClusterMapMarker'
import { default as EventMapMarker } from '../components/map/EventMapMarker'
import UserMapMarker from '../components/map/UserMapMarker'
import { isInBounds } from './MapUtils'

const DynamicMarker = memo(({ clusters, type, selectedEvent, onEventSelected, ...rest }) => {
  return clusters.map(cluster => {
    const options = {}
    if (cluster.count > 1) {
      if (type === 'user' && selectedEvent && isInBounds(cluster.bounds, selectedEvent.assessment.location)) {
        options.focused = true
      }
      return <ClusterMapMarker key={`marker-${cluster.geohash}`} cluster={cluster} {...options} />
    } else if (cluster.user || type === 'user') {
      const userData = cluster.user || cluster.representative
      if (selectedEvent && userData && userData.id && selectedEvent.id === userData.id) {
        options.selected = true
      }
      return <UserMapMarker key={`marker-${cluster.geohash}`} user={userData} onSelected={onEventSelected} {...options} />
    }
    // TODO should *also* highlight corresponding event in list
    // on hover
    return <EventMapMarker key={`marker-${cluster.representative.id}`} event={cluster} {...rest} />
  })
})

DynamicMarker.displayName = 'DynamicMarker'
DynamicMarker.propTypes = {
  clusters: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  onEventSelected: PropTypes.func,
}

export default DynamicMarker
