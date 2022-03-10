export const createRiskEngineSettingsQueryResultMock = (features = {}) => {
  const { AppAnomalyDetection, IpAddressRisk, NetworkAnomalyDetection } = features
  return {
    data: {
      settings: {
        definedGeozones: { enabled: null },
        learnedGeozones: {
          enabled: null,
          geozoneDistance: {
            innerRadius: { value: 100, unit: 'meters' },
            outerRadius: { value: 1, unit: 'kilometers' },
          },
        },
        behavioral: {
          enabled: null,
          riskLevels: [
            { level: 'CRITICAL', range: { min: 80, max: 100 } },
            { level: 'HIGH', range: { min: 40, max: 79 } },
            { level: 'MEDIUM', range: { min: 20, max: 39 } },
            { level: 'LOW', range: { min: 0, max: 19 } },
          ],
        },
        appAnomalyDetection: AppAnomalyDetection
          ? { enabled: false, riskLevel: 'HIGH', range: { min: 66, max: 100 } }
          : { enabled: false },
        networkAnomalyDetection: NetworkAnomalyDetection
          ? { enabled: false, riskLevel: 'HIGH', range: { min: 50, max: 100 } }
          : { enabled: false },
        ipAddress: IpAddressRisk
          ? {
              enabled: false,
              scoreIfBlacklisted: 100,
              scoreIfNotInLists: 20,
              scoreIfNoIPAddress: 60,
              scoreIfWhitelisted: 0,
              vendorScoreCalculationStrategy: 'Mean',
              riskLevels: [
                { level: 'LOW', range: { min: 0, max: 29 } },
                { level: 'MEDIUM', range: { min: 30, max: 59 } },
                { level: 'HIGH', range: { min: 60, max: 89 } },
                { level: 'CRITICAL', range: { min: 90, max: 100 } },
              ],
            }
          : { enabled: false },
      },
    },
  }
}
