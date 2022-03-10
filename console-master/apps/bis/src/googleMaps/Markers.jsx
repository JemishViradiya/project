import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { default as Marker } from './Marker'

const Markers = memo(({ clusters }) => {
  const theme = useTheme()
  return clusters.map(cluster => {
    const { count, lat, lon: lng, geohash } = cluster

    let title = geohash
    if (count > 1) {
      title += `\nCluster of ${count}`
    } else {
      title += '\nSingle'
    }
    // TODO: optimize to not create new objects
    return (
      <Marker
        key={`cluster-loc:${geohash}`}
        position={{ lat, lng }}
        title={title}
        zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
      />
    )
  })
})

Markers.propTypes = {
  clusters: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
      geohash: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default Markers
