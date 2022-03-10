export const ClientParamsQueryMock = apiKey => ({
  clientParams: {
    maps: { apiKey, apiVersion: 'quarterly' },
    features: [
      { key: 'IpAddressRisk', value: 'true', type: 'boolean' },
      { key: 'Correlation', value: 'true', type: 'boolean' },
      { key: 'DynamicsProfiles', value: 'true', type: 'boolean' },
      { key: 'MdmActions', value: 'true', type: 'boolean' },
      { key: 'AppAnomalyDetection', value: 'true', type: 'boolean' },
      { key: 'RiskScoreResponseFormat', value: 'true', type: 'boolean' },
      { key: 'BcpAgentWithNodeCore', value: 'true', type: 'boolean' },
      { key: 'DisplayLoginEvents', value: 'true', type: 'boolean' },
    ],
    support: { helpUrl: 'https://docs.blackberry.com/en/unified-endpoint-security/blackberry-persona-uem/latest' },
    privacyMode: { mode: false, maxZoom: 10, maxPrecision: 5, audit: null },
    capabilities: ['privacyMode', 'dataRetention', 'operatingMode', 'riskEngineSettings', 'policies', 'ipAddress'],
    tenantType: 'UEM',
  },
})
