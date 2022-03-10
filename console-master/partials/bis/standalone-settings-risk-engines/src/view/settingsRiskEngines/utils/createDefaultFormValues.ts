import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

import { IpAddressScore } from '../components/IpAddressRisk/IpAddressRisk'
import DefaultAppAnomalyValues from '../static/DefaultAppAnomalyValues'
import DefaultNetworkAnomalyValues from '../static/DefaultNetworkAnomalyValues'
import UnitTypes from '../static/UnitTypes'

const DEFAULT_ENABLEMENT = false
const DEFAULT_BEHAVIORAL_RISK_LEVELS = [
  {
    level: RiskLevel.HIGH,
    range: {
      min: 80,
      max: 100,
    },
  },
  {
    level: RiskLevel.MEDIUM,
    range: {
      min: 40,
      max: 80,
    },
  },
  {
    level: RiskLevel.LOW,
    range: {
      min: 0,
      max: 40,
    },
  },
]

const DEFAULT_GEOZONE_DISTANCE = Object.freeze({
  innerRadius: {
    value: 150,
    unit: UnitTypes.yards,
  },
  outerRadius: {
    value: 10,
    unit: UnitTypes.miles,
  },
})

export const DEFAULT_IP_ADDRESS_RISK_LEVELS = [
  { level: RiskLevel.LOW, range: { min: 0, max: 29 } },
  { level: RiskLevel.MEDIUM, range: { min: 30, max: 59 } },
  { level: RiskLevel.HIGH, range: { min: 60, max: 89 } },
  { level: RiskLevel.CRITICAL, range: { min: 90, max: 100 } },
]

const DEFAULT_IP_ADDRESS = Object.freeze({
  scoreIfBlacklisted: RiskLevel.CRITICAL,
  scoreIfNotInLists: RiskLevel.MEDIUM,
  scoreIfNoIPAddress: RiskLevel.MEDIUM,
  scoreIfWhitelisted: RiskLevel.LOW,
})

const isEnabled = (storedData, riskEngine) => storedData?.[riskEngine]?.enabled || DEFAULT_ENABLEMENT

export const getDefaultIpAddressLevel = (storedData, name) => {
  const score = storedData?.ipAddress?.[name]
  const ipAdressRiskLevels = storedData?.ipAddress?.riskLevels || DEFAULT_IP_ADDRESS_RISK_LEVELS

  if (score === undefined || score === null) {
    return DEFAULT_IP_ADDRESS[name]
  }

  const riskLevel = ipAdressRiskLevels
    .filter(riskLevel => score >= riskLevel?.range?.min && score <= riskLevel?.range?.max)
    .map(riskLevel => riskLevel.level)

  return riskLevel.length > 0 ? riskLevel[0] : RiskLevel.MEDIUM
}

const getDefaultIpAddressScore = (storedData, name) => IpAddressScore[getDefaultIpAddressLevel(storedData, name)]

export default (storedData, IpAddressRisk, NetworkAnomalyDetection) => ({
  learnedGeozones: {
    enabled: isEnabled(storedData, 'learnedGeozones'),
    geozoneDistance: storedData?.learnedGeozones?.geozoneDistance || DEFAULT_GEOZONE_DISTANCE,
  },
  definedGeozones: {
    enabled: isEnabled(storedData, 'definedGeozones'),
  },
  behavioral: {
    enabled: isEnabled(storedData, 'behavioral'),
    riskLevels: storedData?.behavioral?.riskLevels || DEFAULT_BEHAVIORAL_RISK_LEVELS,
  },
  appAnomalyDetection: {
    enabled: isEnabled(storedData, 'appAnomalyDetection'),
    riskLevel: storedData?.appAnomalyDetection?.riskLevel || DefaultAppAnomalyValues.riskLevel,
    range: storedData?.appAnomalyDetection?.range || DefaultAppAnomalyValues.range,
  },
  ...(NetworkAnomalyDetection && {
    networkAnomalyDetection: {
      enabled: isEnabled(storedData, 'networkAnomalyDetection'),
      riskLevel: storedData?.riskEnginesSettings?.networkAnomalyDetection?.riskLevel || DefaultNetworkAnomalyValues.riskLevel,
      range: storedData?.riskEnginesSettings?.networkAnomalyDetection?.range || DefaultNetworkAnomalyValues.range,
    },
  }),
  ...(IpAddressRisk && {
    ipAddress: {
      enabled: isEnabled(storedData, 'ipAddress'),
      scoreIfBlacklisted: IpAddressScore.CRITICAL,
      scoreIfNotInLists: getDefaultIpAddressScore(storedData, 'scoreIfNotInLists'),
      scoreIfNoIPAddress: getDefaultIpAddressScore(storedData, 'scoreIfNoIPAddress'),
      scoreIfWhitelisted: IpAddressScore.LOW,
      vendorScoreCalculationStrategy: storedData?.ipAddress?.vendorScoreCalculationStrategy || 'Mean',
      riskLevels: storedData?.ipAddress?.riskLevels || DEFAULT_IP_ADDRESS_RISK_LEVELS,
    },
  }),
})
