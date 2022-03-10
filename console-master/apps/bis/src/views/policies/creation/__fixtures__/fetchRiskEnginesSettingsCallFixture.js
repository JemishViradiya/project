import { RiskEnginesSettingsQuery } from '@ues-data/bis'

const defaultRiskEngineSettingsQueryResult = {
  data: {
    settings: {
      definedGeozones: { enabled: true },
      learnedGeozones: {
        enabled: true,
        geozoneDistance: {
          innerRadius: { value: 100, unit: 'meters' },
          outerRadius: { value: 1, unit: 'kilometers' },
        },
      },
      behavioral: {
        enabled: true,
        riskLevels: [
          { level: 'CRITICAL', range: { min: 80, max: 100 } },
          { level: 'HIGH', range: { min: 40, max: 79 } },
          { level: 'MEDIUM', range: { min: 20, max: 39 } },
          { level: 'LOW', range: { min: 0, max: 19 } },
        ],
      },
      appAnomalyDetection: { enabled: null },
      ipAddress: {
        enabled: null,
        scoreIfBlacklisted: null,
        scoreIfNotInLists: null,
        scoreIfNoIPAddress: null,
        scoreIfWhitelisted: null,
      },
    },
  },
}

const riskEnginesSettingsCall = {
  request: { query: RiskEnginesSettingsQuery(false, false).query },
  result: defaultRiskEngineSettingsQueryResult,
}

export default riskEnginesSettingsCall
