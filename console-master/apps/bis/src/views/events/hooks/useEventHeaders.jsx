import moment from 'moment'
import React from 'react'

import AppAnomalyRiskLevel from '../../../components/AppAnomalyRiskLevel'
import BehavioralPatternRiskInfo from '../../../components/BehavioralPatternRiskInfo'
import GeozoneIcon from '../../../components/icons/GeozoneIcon'
import NetworkAnomalyRiskLevel from '../../../components/NetworkAnomalyRiskLevel'
import { Action, common, FixupState, RiskLevelBlob, RiskLevelLabel as Label, useClientParams } from '../../../shared'

const riskStatus = 'usersEvents.riskStatus'
const accessService = 'usersEvents.accessService'

const getSourceData = name => ({ assessment: { datapoint } }) => {
  if (datapoint && datapoint.source) {
    return datapoint.source[name]
  }
}

const behavioralRiskLevel = t => ({
  section: riskStatus,
  columnName: 'risk.common.identityRisk',
  dataKey: 'behavioralRiskLevel',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => ({ level: data.assessment.behavioralRiskLevel, updated: data.updated, fixup: data.fixup }),
  cellRenderer: ({ data: { level, updated, fixup } }) => <RiskLevelBlob level={level} updated={updated} fixup={fixup} />,
  width: 105,
  visible: true,
  defaultVisible: true,
  disabled: true,
})
const appAnomalyDetection = t => ({
  section: riskStatus,
  columnName: 'risk.common.appAnomaly',
  dataKey: 'appAnomalyDetection',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => data.assessment.mappings.appAnomalyDetection?.riskScore,
  cellRenderer: ({ data: riskScore }) => <AppAnomalyRiskLevel riskScore={riskScore} />,
  width: 70,
  visible: true,
  defaultVisible: false,
  disabled: false,
})
const networkAnomalyDetection = t => ({
  section: riskStatus,
  columnName: 'risk.common.networkAnomaly',
  dataKey: 'networkAnomalyDetection',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => data.assessment.mappings.networkAnomalyDetection?.riskScore,
  cellRenderer: ({ data: riskScore }) => <NetworkAnomalyRiskLevel riskScore={riskScore} />,
  width: 70,
  visible: true,
  defaultVisible: false,
  disabled: false,
})
const riskScore = t => ({
  section: riskStatus,
  columnName: 'risk.common.behavioralPatternRiskScore',
  dataKey: 'riskScore',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => {
    const { score, riskLevel } = data.assessment.mappings.behavioral
    return <BehavioralPatternRiskInfo score={score} level={riskLevel} />
  },
  width: 70,
  visible: true,
  defaultVisible: true,
})
const geozoneRiskLevel = t => ({
  section: riskStatus,
  columnName: 'common.geozoneRisk',
  dataKey: 'geozoneRiskLevel',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => data.assessment.geozoneRiskLevel,
  cellRenderer: ({ data }) => <GeozoneIcon level={data} marginTop={4} />,
  width: 80,
  visible: true,
  defaultVisible: true,
})
const fixup = t => ({
  section: riskStatus,
  columnName: 'common.automaticRiskReduction',
  dataKey: 'fixup',
  disableSort: true,
  cellDataGetter: data => data.fixup,
  cellRenderer: ({ data }) => <FixupState fixup={data} />,
  width: 200,
  visible: true,
  defaultVisible: true,
})
const ipAddress = t => ({
  section: riskStatus,
  columnName: 'common.ipAddress',
  dataKey: 'ipAddress',
  disableSort: false,
  cellDataGetter: data => data.assessment.ipAddress,
  width: 120,
  visible: false,
  defaultVisible: false,
})
export const ipRisk = t => ({
  section: riskStatus,
  columnName: 'common.ipRisk',
  dataKey: 'ipRisk',
  disableSort: false,
  cellDataGetter: data => t(Label[common.getIpAddressRisk(data?.assessment?.mappings?.ipAddress?.mappings?.source)]),
  width: 120,
  visible: false,
  defaultVisible: false,
})
const userInfo = t => ({
  section: 'common.user',
  columnName: 'common.user',
  dataKey: 'userInfo',
  disableSort: true,
  cellDataGetter: data => data.assessment.userInfo.displayName,
  width: 120,
  visible: true,
  defaultVisible: true,
})
const deviceModel = t => ({
  section: 'usersEvents.accessDevice',
  columnName: 'usersEvents.deviceModel',
  dataKey: 'deviceModel',
  disableSort: true,
  cellDataGetter: getSourceData('deviceModel'),
  dataFormatter: data => data,
  width: 120,
  visible: false,
  defaultVisible: false,
})
const appOrService = t => ({
  section: accessService,
  columnName: 'usersEvents.appOrService',
  dataKey: 'appOrService',
  disableSort: true,
  cellDataGetter: getSourceData('appName'),
  dataFormatter: data => data,
  width: 120,
  visible: false,
  defaultVisible: false,
})
const location = t => ({
  section: accessService,
  columnName: 'common.location',
  dataKey: 'location',
  disableSort: true,
  cellDataGetter: ({ assessment: { location } }) => {
    return location ? `${location.lat.toFixed(5)}, ${location.lon.toFixed(5)}` : ''
  },
  width: 180,
  visible: false,
  defaultVisible: false,
})
const actions = t => ({
  section: 'usersEvents.securityAction',
  columnName: 'usersEvents.appliedActions',
  dataKey: 'actions',
  disableSort: true,
  cellDataGetter: ({ operatingMode, sisActions }) => {
    return { operatingMode, sisActions }
  },
  cellRenderer: ({ data: { operatingMode, sisActions } }) => {
    return <Action oneColumn maxResultsPerColumn={2} operatingMode={operatingMode} sisActions={sisActions} />
  },
  width: 300,
  visible: false,
  defaultVisible: false,
})
const datetime = t => ({
  section: accessService,
  columnName: 'common.time',
  dataKey: 'datetime',
  disableSort: false,
  defaultSortDirection: 'DESC',
  cellDataGetter: data => moment(data.assessment.datetime).fromNow(),
  width: 180,
  visible: true,
  defaultVisible: true,
  disabled: true,
})

const useEventHeaders = () => {
  const {
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams()

  return {
    behavioralRiskLevel,
    geozoneRiskLevel,
    riskScore,
    fixup,
    ipAddress,
    userInfo,
    deviceModel,
    appOrService,
    location,
    actions,
    datetime,
    ...(RiskScoreResponseFormat && { appAnomalyDetection }),
    ...(RiskScoreResponseFormat && NetworkAnomalyDetection && { networkAnomalyDetection }),
    ...(IpAddressRisk && { ipRisk }),
  }
}

export default useEventHeaders
