import React, { memo, useMemo } from 'react'

import { UserDetailsGeozoneQuery, UserDetailsUnknownLocationQuery } from '@ues-data/bis'

import { useAutoZoom } from '../../list/hooks'
import Map from '../../list/Map'
import { RiskLevel, UnknownLocation } from '../../shared'

const dataAccessor = data => data.eventGeoClusters

const unknownLocationAccessor = data => data.eventUserDetailsUnknownLocation.total

const UserInfoClusterMap = memo(({ variables, ...rest }, ref) => {
  const autoZoomCount = useAutoZoom(variables)

  const renderUnknownLocation = useMemo(() => {
    const unknownLocationVariables = {
      ...variables,
      location: [RiskLevel.UNKNOWN_LOC],
    }
    return (
      <UnknownLocation
        query={UserDetailsUnknownLocationQuery}
        variables={unknownLocationVariables}
        dataAccessor={unknownLocationAccessor}
      />
    )
  }, [variables])

  return (
    <Map
      query={UserDetailsGeozoneQuery}
      id="UserDetailsMap"
      variables={variables}
      dataAccessor={dataAccessor}
      autoZoomCount={autoZoomCount.current}
      markerType="user"
      leftBottomNode={renderUnknownLocation}
      {...rest}
    />
  )
})
UserInfoClusterMap.displayName = 'UserInfoClusterMap'

export default UserInfoClusterMap
