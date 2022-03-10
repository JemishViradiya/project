export const BucketedUserEventsQueryMock = {
  bucketedUserEvents: {
    interval: 868580,
    buckets: [
      {
        datetime: 1605170583200,
        low: 1,
        medium: 0,
        high: 0,
        critical: 0,
        unknown: 0,
        total: 1,
        lastEventInBucket: {
          riskLevel: null,
          fixup: 'not_applicable',
          updated: null,
          assessment: {
            behavioralRiskLevel: 'LOW',
            datetime: 1605171280941,
            eEcoId: 'GNJHQmwLx8oM33qi7Dg3HwPMITbY=',
            ipAddress: '55.236.122.12',
            geozoneRiskLevel: 'MEDIUM',
            location: { lat: 43.6962449461394, lon: -79.40943896461229, geohash: 'dpz88fxv1fqw' },
            mappings: {
              behavioral: { score: 89.79520795705034, riskLevel: 'UNKNOWN' },
              definedgeozone: { meta: { geozoneName: null } },
              appAnomalyDetection: { riskScore: 55.22554150414784 },
              ipAddress: { riskScore: 13.939625078290128, mappings: { source: 'noIPAddress' } },
            },
            datapoint: {
              datapointId: 'eca0f042-2785-4d98-a6a8-606f20d4b911',
              source: {
                appName: null,
                appVersion: null,
                os: null,
                osVersion: null,
                deviceType: null,
                deviceModel: null,
                timezone: null,
              },
            },
            userInfo: {
              avatar: null,
              displayName: 'Micaela Ratke',
              department: 'Legal',
              givenName: 'Micaela',
              familyName: 'Ratke',
              username: 'Micaela.Lang29',
              primaryEmail: 'micaela_ratke@xxx.com',
              title: 'International Optimization Agent',
            },
          },
          operatingMode: 'ACTIVE',
          sisActions: {
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
      },
    ],
  },
}
