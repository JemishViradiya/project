export const EventListQueryMock = {
  eventInfiniteScroll: {
    total: 5,
    events: [
      {
        id: 'N8Kqu3UBiunvjNbqAiUW',
        operatingMode: 'ACTIVE',
        fixup: 'in_progress',
        updated: null,
        assessment: {
          eEcoId: 'Vr+gQRoRxdS+Le+0llP87XFtHHNk=',
          userInfo: {
            displayName: null,
          },
          datetime: 1605171280940,
          behavioralRiskLevel: 'UNKNOWN',
          geozoneRiskLevel: 'HIGH',
          location: {
            lat: 41.88447045803058,
            lon: -87.65256155606015,
            geohash: 'dp3wm2v6er0y',
          },
          ipAddress: '252.150.239.190',
          mappings: {
            behavioral: {
              score: 47.488243825473305,
              riskLevel: 'UNKNOWN',
            },
            definedgeozone: {
              meta: {
                geozoneId: null,
                geozoneName: null,
              },
            },
            appAnomalyDetection: {
              riskScore: 51.025821462236465,
            },
            ipAddress: {
              riskScore: 22,
              mappings: {
                source: 'notInLists',
              },
            },
          },
          datapoint: {
            source: {
              appName: 'BlackBerry TeamConnect',
              deviceModel: 'Model Sun',
            },
          },
        },
        sisActions: {
          policyName: 'Policy_494e5962-b622-4ad4-b53b-dfc31d32d6c2',
          actions: [
            {
              type: 'app:reAuthenticateToConfirm',
              groupId: null,
              groupName: null,
              profileId: null,
              profileName: null,
              alertMessage: null,
            },
            {
              type: 'app:assignDynamicsProfile',
              groupId: null,
              groupName: null,
              profileId: '00000000-0000-0000-0000-000000000001',
              profileName: 'demo profile 1',
              alertMessage: null,
            },
          ],
        },
      },
      {
        id: 'ScKqu3UBiunvjNbqCCUP',
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'x2jBcbSIebK5lia51sBxnWeY0yeY=',
          userInfo: { displayName: 'Lance McLaughlin' },
          datetime: 1605171280941,
          behavioralRiskLevel: 'UNKNOWN',
          geozoneRiskLevel: 'HIGH',
          location: { lat: 35.67603565103202, lon: 139.71767575336892, geohash: 'xn76gqe7cz44' },
          ipAddress: '113.214.38.185',
          mappings: {
            behavioral: { score: 27.325430621881885, riskLevel: 'UNKNOWN' },
            definedgeozone: { meta: { geozoneId: null, geozoneName: null } },
            appAnomalyDetection: { riskScore: 86.3110132999707 },
            ipAddress: { riskScore: 0.12134213885452994, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { appName: null, deviceModel: null } },
        },
        sisActions: { policyName: null, actions: [] },
      },
      {
        id: 'S8Kqu3UBiunvjNbqCCUP',
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'GNJHQmwLx8oM33qi7Dg3HwPMITbY=',
          userInfo: { displayName: 'Micaela Ratke' },
          datetime: 1605171280941,
          behavioralRiskLevel: 'LOW',
          geozoneRiskLevel: 'MEDIUM',
          location: { lat: 43.6962449461394, lon: -79.40943896461229, geohash: 'dpz88fxv1fqw' },
          ipAddress: '55.236.122.12',
          mappings: {
            behavioral: { score: 89.79520795705034, riskLevel: 'UNKNOWN' },
            definedgeozone: { meta: { geozoneId: null, geozoneName: null } },
            appAnomalyDetection: { riskScore: 55.22554150414784 },
            ipAddress: { riskScore: 13.939625078290128, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { appName: null, deviceModel: null } },
        },
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
      {
        id: 'TMKqu3UBiunvjNbqCCUP',
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'e397MOa+t5uVDki1dAj/anRNDDEQ=',
          userInfo: { displayName: null },
          datetime: 1605171280941,
          behavioralRiskLevel: 'UNKNOWN',
          geozoneRiskLevel: 'HIGH',
          location: { lat: 0, lon: 0, geohash: 's00000000000' },
          ipAddress: '255.116.72.149',
          mappings: {
            behavioral: { score: -1, riskLevel: null },
            definedgeozone: { meta: { geozoneId: null, geozoneName: null } },
            appAnomalyDetection: { riskScore: 57.68620842404262 },
            ipAddress: { riskScore: 33, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { appName: 'BlackBerry Analytics', deviceModel: 'Model Mars' } },
        },
        sisActions: { policyName: null, actions: [] },
      },
      {
        id: 'TcKqu3UBiunvjNbqCCUP',
        operatingMode: 'ACTIVE',
        fixup: 'not_applicable',
        updated: null,
        assessment: {
          eEcoId: 'iVJf+4kJw1Cip3g0vjQzImfZofmk=',
          userInfo: { displayName: 'Juana Lebsack' },
          datetime: 1605171280941,
          behavioralRiskLevel: 'CRITICAL',
          geozoneRiskLevel: 'HIGH',
          location: { lat: 40.68678289048198, lon: -73.93820310951803, geohash: 'dr5rmqzcdypc' },
          ipAddress: '51.190.120.162',
          mappings: {
            behavioral: { score: 91.61721260965061, riskLevel: 'CRITICAL' },
            definedgeozone: { meta: { geozoneId: 'dead-beef', geozoneName: 'Cattle Ranch' } },
            appAnomalyDetection: { riskScore: 41.984922839529844 },
            ipAddress: { riskScore: 63.06928734156563, mappings: { source: 'noIPAddress' } },
          },
          datapoint: { source: { appName: 'BlackBerry TeamConnect', deviceModel: 'Model Sun' } },
        },
        sisActions: { policyName: null, actions: [] },
      },
    ],
  },
}
