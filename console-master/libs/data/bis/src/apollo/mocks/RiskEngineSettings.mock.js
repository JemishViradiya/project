const settings = {
  learnedGeozones: {
    enabled: true,
    geozoneDistance: { innerRadius: { value: 150, unit: 'yards' }, outerRadius: { value: 10, unit: 'miles' } },
  },
  definedGeozones: { enabled: true },
  behavioral: {
    enabled: true,
    riskLevels: [
      { level: 'HIGH', range: { min: 80, max: 100 } },
      { level: 'MEDIUM', range: { min: 40, max: 80 } },
      { level: 'LOW', range: { min: 0, max: 40 } },
    ],
  },
  appAnomalyDetection: { enabled: true, riskLevel: 'HIGH', range: { min: 80, max: 100 } },
  networkAnomalyDetection: {
    enabled: true,
    riskLevel: 'HIGH',
    range: { min: 80, max: 100 },
  },
  ipAddress: {
    enabled: false,
    scoreIfBlacklisted: 100,
    scoreIfNotInLists: 30,
    scoreIfNoIPAddress: 30,
    scoreIfWhitelisted: 0,
    vendorScoreCalculationStrategy: 'Mean',
    riskLevels: [
      { level: 'LOW', range: { min: 0, max: 29 } },
      { level: 'MEDIUM', range: { min: 30, max: 59 } },
      { level: 'HIGH', range: { min: 60, max: 89 } },
      { level: 'CRITICAL', range: { min: 90, max: 100 } },
    ],
  },
}

export const RiskEnginesSettingsQueryMock = { settings }

export const RiskEnginesSettingsMutationMock = { settings }
