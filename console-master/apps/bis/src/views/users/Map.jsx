import isEqual from 'lodash-es/isEqual'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { MapGeozoneQuery, MapUnknownLocationQuery } from '@ues-data/bis'

import { useAutoZoom } from '../../list/hooks'
import Map, { getMapViewStorageId } from '../../list/Map'
import { RiskLevel, UnknownLocation, useClientParams } from '../../shared'

const dataAccessor = data => data.userGeoClusters

const unknownLocationAccessor = data => data.usersUnknownLocation.total

const MapName = 'UserMap'
export const MapStorageId = getMapViewStorageId(MapName)

export default memo(({ variables, onFilterChange }) => {
  const mapView = useRef()
  const location = useLocation()
  const {
    features: { RiskScoreResponseFormat = false, IpAddressRisk = false, NetworkAnomalyDetection = false },
  } = useClientParams() || {}
  const geoQuery = useMemo(() => MapGeozoneQuery(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection), [
    RiskScoreResponseFormat,
    IpAddressRisk,
    NetworkAnomalyDetection,
  ])
  const unknownLocationQuery = useMemo(
    () => MapUnknownLocationQuery(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection),
    [RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection],
  )
  const { listMapView } = location.state || {}
  let autoView
  if (listMapView && (!mapView.current || !isEqual(mapView.current, listMapView))) {
    mapView.current = listMapView
    autoView = listMapView
  }

  const autoZoomCount = useAutoZoom(variables)
  const knownOnly = useMemo(() => {
    return variables.location && variables.location.length === 1 && variables.location[0] === RiskLevel.KNOWN_LOC
  }, [variables.location])

  const onClickUnknown = useCallback(() => {
    if (variables.location && variables.location.find(status => status === RiskLevel.UNKNOWN_LOC)) {
      return
    }
    onFilterChange(RiskLevel.LocationOptions.field, RiskLevel.UNKNOWN_LOC)
  }, [onFilterChange, variables.location])

  const renderUnknownLocation = useMemo(() => {
    if (knownOnly) return null
    const unknownLocationVariables = {
      ...variables,
      location: [RiskLevel.UNKNOWN_LOC],
    }
    return (
      <UnknownLocation
        query={unknownLocationQuery}
        variables={unknownLocationVariables}
        dataAccessor={unknownLocationAccessor}
        onClick={onClickUnknown}
      />
    )
  }, [knownOnly, onClickUnknown, unknownLocationQuery, variables])

  return (
    <Map
      id={MapName}
      dataAccessor={dataAccessor}
      query={geoQuery}
      variables={variables}
      autoZoomCount={autoZoomCount.current}
      leftBottomNode={renderUnknownLocation}
      autoView={autoView}
    />
  )
})
