import PropTypes from 'prop-types'
import React, { memo, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { EventDetailsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

import MapSplitter from '../../list/MapSplitter'
import MapOptionsProvider from '../../providers/MapOptionsProvider'
import { default as RiskEngineSettingsProvider } from '../../providers/RiskEngineSettingsProvider'
import { common, Loading, LocalStorageKeys, useClientParams, useLocalStorage } from '../../shared'
import { default as EventInfoDetails } from './EventInfoDetails'
import EventInfoMap from './EventInfoMap'

const EventInfoView = memo(({ eventId }) => {
  const { t } = useTranslation()
  const [mapOptions] = useContext(MapOptionsProvider.Context)
  const riskTypes = useMemo(() => [...mapOptions.riskTypes], [mapOptions.riskTypes])
  const queryOptions = useMemo(
    () => ({
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: { id: eventId, riskTypes },
    }),
    [eventId, riskTypes],
  )
  const {
    features: { RiskScoreResponseFormat = false, IpAddressRisk = false, NetworkAnomalyDetection = false } = {},
  } = useClientParams()
  const query = useMemo(() => EventDetailsQuery(RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection), [
    RiskScoreResponseFormat,
    IpAddressRisk,
    NetworkAnomalyDetection,
  ])
  const [viewData, saveViewData] = useLocalStorage(LocalStorageKeys.VIEW_EVENT, { showMap: true })
  const { loading, error, data } = useStatefulApolloQuery(query, queryOptions)
  if (error) {
    // FIXME: report error to UI if needed in future.
    console.log('Error when fetching event details: ', error)
    return null
  }
  if (loading && !data) {
    return <Loading />
  }

  // This is just an adapter to make getting the info more convenient.
  const eventDetails = {
    eEcoId: data.eventDetails.assessment.eEcoId,
    riskLevel: data.eventDetails.assessment.behavioralRiskLevel,
    behavioralRiskLevel: data.eventDetails.assessment.mappings.behavioral.riskLevel,
    behavioralRiskScore: data.eventDetails.assessment.mappings.behavioral.score,
    appAnomalyRiskScore: RiskScoreResponseFormat
      ? data.eventDetails.assessment.mappings?.appAnomalyDetection?.riskScore
      : undefined,
    networkAnomalyRiskScore:
      RiskScoreResponseFormat && NetworkAnomalyDetection
        ? data.eventDetails.assessment.mappings?.networkAnomalyDetection?.riskScore
        : undefined,
    geozoneRiskLevel: data.eventDetails.assessment.geozoneRiskLevel,
    updated: data.eventDetails.updated,
    fixup: data.eventDetails.fixup,
    userInfo: data.eventDetails.assessment.userInfo,
    datetime: data.eventDetails.assessment.datetime,
    location: data.eventDetails.assessment.location,
    ipAddress: data.eventDetails.assessment.ipAddress,
    datapointId: data.eventDetails.assessment.datapoint && data.eventDetails.assessment.datapoint.datapointId,
    ipAddressType: IpAddressRisk ? common.getIpAddressType(data?.eventDetails?.assessment?.mappings?.ipAddress, t) : undefined,
    source: (data.eventDetails.assessment.datapoint && data.eventDetails.assessment.datapoint.source) || {},
    geozoneName:
      (data.eventDetails.assessment.mappings &&
        data.eventDetails.assessment.mappings.definedgeozone &&
        data.eventDetails.assessment.mappings.definedgeozone.meta &&
        data.eventDetails.assessment.mappings.definedgeozone.meta.geozoneName) ||
      '',
    operatingMode: data.eventDetails.operatingMode,
    sisActions: data.eventDetails.sisActions,
  }

  const infoView = ({ showMap, onShowMap, onHideMap }) => {
    if (showMap !== viewData.showMap) {
      viewData.showMap = showMap
      saveViewData(viewData)
    }
    return (
      <RiskEngineSettingsProvider>
        <EventInfoDetails {...eventDetails} eventId={eventId} showMap={showMap} onShowMap={onShowMap} onHideMap={onHideMap} />
      </RiskEngineSettingsProvider>
    )
  }
  const map = () => <EventInfoMap riskEvent={data.eventDetails} eventId={eventId} />
  return (
    <MapSplitter showMap={viewData.showMap} primaryMinSize={340} secondaryMinSize={0}>
      {infoView}
      {map}
    </MapSplitter>
  )
})

EventInfoView.displayName = 'EventInfoView'

EventInfoView.propTypes = {
  eventId: PropTypes.string.isRequired,
}

export default EventInfoView
