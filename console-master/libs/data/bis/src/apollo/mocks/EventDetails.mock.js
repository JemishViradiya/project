export const EventDetailsQueryMock = {
  eventDetails: {
    riskLevel: 'CRITICAL',
    fixup: 'not_applicable',
    updated: null,
    assessment: {
      behavioralRiskLevel: 'CRITICAL',
      datetime: 1605171280940,
      eEcoId: '2VKtqeoQimrFWyUi6jTtsed3ZVTY=',
      ipAddress: '237.234.37.197',
      geozoneRiskLevel: 'UNKNOWN',
      location: { lat: 40.68678289048198, lon: -73.93820310951803, geohash: 'dr5rmqzcdypc' },
      mappings: {
        behavioral: { score: 41.103109608296634, riskLevel: 'UNKNOWN' },
        definedgeozone: { meta: { geozoneName: 'Cozy Cottage' } },
        appAnomalyDetection: { riskScore: 18.19838505958834 },
        ipAddress: { riskScore: 55.82627473439649, mappings: { source: 'noIPAddress' } },
      },
      datapoint: {
        datapointId: 'a4c815fe-5a98-418e-9272-94a2931b0ed1',
        source: {
          appName: 'BlackBerry Work',
          appVersion: '1.1.1',
          os: 'IOS',
          osVersion: '9',
          deviceType: 'PHONE',
          deviceModel: 'Model Moon',
          timezone: 'BIT',
        },
      },
      userInfo: {
        avatar: null,
        displayName: 'Oleta Russel',
        department: 'Consumer',
        givenName: 'Oleta',
        familyName: 'Russel',
        username: 'Oleta21',
        primaryEmail: 'oleta.russel21@xxx.com',
        title: 'Legacy Assurance Associate',
      },
    },
    operatingMode: 'PASSIVE',
    sisActions: {
      policyName: 'Policy_34e06d9c-ebd0-4aa5-b2d2-f6f76f44cbdc',
      actions: [
        {
          type: 'app:assignDynamicsProfile',
          groupId: null,
          groupName: null,
          profileId: '00000000-0000-0000-0000-000000000003',
          profileName: 'demo profile 3',
          alertMessage: null,
        },
        { type: 'uem:blockApplications', groupId: null, groupName: null, profileId: null, profileName: null, alertMessage: null },
      ],
    },
  },
}
