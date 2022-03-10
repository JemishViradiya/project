export const UserListQueryMock = {
  users: {
    total: 2,
    users: [
      {
        id: 'v55953443_GNJHQmwLx8oM33qi7Dg3HwPMITbY=',
        info: { displayName: null, department: null, primaryEmail: null, title: null },
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'GNJHQmwLx8oM33qi7Dg3HwPMITbY=',
          datetime: 1605171280941,
          behavioralRiskLevel: 'LOW',
          geozoneRiskLevel: 'MEDIUM',
          ipAddress: '55.236.122.12',
          location: { lat: 43.6962449461394, lon: -79.40943896461229 },
          mappings: {
            behavioral: { score: 89.79520795705034, riskLevel: 'UNKNOWN' },
            definedgeozone: { meta: { geozoneId: null, geozoneName: null } },
            appAnomalyDetection: { riskScore: 55.22554150414784 },
            ipAddress: { riskScore: 13.939625078290128, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { deviceModel: null } },
        },
        sisActions: {
          policyGuid: '54fbfe8f-c915-4da1-b711-f1c8b4ab3dc7',
          policyName: 'Policy_74975ba4-75ae-44cf-8107-48a16d5d7046',
          actions: [
            {
              type: 'uem:assignGroup',
              groupId: '00000000-0000-0000-0000-000000000004',
              groupName: 'demo group 4',
              profileId: null,
              profileName: null,
              alertMessage: null,
            },
          ],
        },
      },
      {
        id: 'v55953443_e397MOa+t5uVDki1dAj/anRNDDEQ=',
        info: {
          displayName: 'Ross Stanton',
          department: 'Northern',
          primaryEmail: 'ross_stanton@xxx.com',
          title: 'Internal Tactics Strategist',
        },
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'e397MOa+t5uVDki1dAj/anRNDDEQ=',
          datetime: 1605171280941,
          behavioralRiskLevel: 'UNKNOWN',
          geozoneRiskLevel: 'HIGH',
          ipAddress: '255.116.72.149',
          location: { lat: 0, lon: 0 },
          mappings: {
            behavioral: { score: -1, riskLevel: null },
            definedgeozone: { meta: { geozoneId: null, geozoneName: null } },
            appAnomalyDetection: { riskScore: 57.68620842404262 },
            ipAddress: { riskScore: 33, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { deviceModel: 'Model Mars' } },
        },
        sisActions: { policyGuid: null, policyName: null, actions: [] },
      },
    ],
  },
}
