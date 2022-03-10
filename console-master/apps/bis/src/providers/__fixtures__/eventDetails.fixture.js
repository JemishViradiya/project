// We need to have some event mocked with all the fields (even null) equal to the query selection
// as otherwise MockedProvider will not deliver "data"
export const testMockEvent = {
  riskLevel: null,
  fixup: null,
  updated: null,
  assessment: {
    behavioralRiskLevel: 'CRITICAL',
    datetime: 34565432456,
    eEcoId: 'E_ECO_ID',
    ipAddress: null,
    geozoneRiskLevel: 'HIGH',
    location: {
      lat: 40,
      lon: -35.5,
      geohash: 'fakehash',
    },
    mappings: {
      behavioral: {
        score: 10,
        riskLevel: null,
      },
      definedgeozone: null,
    },
    datapoint: {
      datapointId: 'DATAPOINT_ID',
      source: null,
    },
    userInfo: {
      avatar: null,
      displayName: null,
      department: null,
      givenName: null,
      familyName: null,
      username: null,
      primaryEmail: null,
      title: null,
    },
  },
  operatingMode: 'ACTIVE',
  sisActions: {
    actions: [],
    policyName: 'POLICY_NAME',
  },
}
