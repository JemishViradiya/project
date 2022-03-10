// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import type { ReportingServiceTunnelAggResponse } from '../../types'
import { ReportingServiceField } from '../../types'

export const aggregatedNetworkTrafficMock: Partial<Record<ReportingServiceField, ReportingServiceTunnelAggResponse>> = {
  [ReportingServiceField.EcoId]: {
    tenant: {
      tunnelAgg: {
        totalHits: 100,
        buckets: [
          {
            key: 'AtuX3Hyj9T28ymX60FobmRM=',
            count: 28,
            traffic: {
              bytes_toclient: 2700,
              bytes_toserver: 2200,
              bytes_total: 4900,
            },
            fieldCounts: [],
            allowed: 12,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'AgXYu1xX2ZBZ8iQsZJ61RLA=',
            count: 16,
            traffic: {
              bytes_toclient: 1804,
              bytes_toserver: 1336,
              bytes_total: 3140,
            },
            fieldCounts: [],
            allowed: 4,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'BtuP3Lyj9T28ymX60FobmUI=',
            count: 14,
            traffic: {
              bytes_toclient: 4510,
              bytes_toserver: 3340,
              bytes_total: 7850,
            },
            fieldCounts: [],
            allowed: 4,
            blocked: 0,
            maxTsTerm: '1606160728000',
          },
        ],
        userInfo: [
          {
            ecoId: 'AtuX3Hyj9T28ymX60FobmRM=',
            email: 'hblaine@example.com',
            firstName: 'Hubert Blaine ',
            lastName: 'Wolfeschlegelsteinhausen',
            userName: 'hubert-blaine',
            displayName: 'hubert-blaine',
          },
          {
            ecoId: 'AgXYu1xX2ZBZ8iQsZJ61RLA=',
            email: 'ubob@test.com',
            firstName: 'Uncle',
            lastName: 'Bob',
            userName: 'uncle-bob',
            displayName: 'uncle-bob',
          },
          {
            ecoId: 'BtuP3Lyj9T28ymX60FobmUI=',
            email: 'jdoe3@test.com',
            firstName: 'John',
            lastName: 'Doe3',
            userName: 'test-user3',
            displayName: 'test-user3',
          },
        ],
      },
    },
  },
  [ReportingServiceField.AppDest]: {
    tenant: {
      tunnelAgg: {
        totalHits: 100,
        buckets: [
          {
            key: 'Office365',
            count: 12,
            traffic: {
              bytes_toclient: 100,
              bytes_toserver: 150,
              bytes_total: 250,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 3,
              },
            ],
            allowed: 12,
            blocked: 6,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'local-dev-ues-final-version.cylance.com',
            count: 12,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 253,
              bytes_total: 5253,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
            allowed: 8,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'appname2',
            count: 4,
            traffic: {
              bytes_toclient: 1000,
              bytes_toserver: 20000,
              bytes_total: 21000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
            allowed: 4,
            blocked: 0,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'appname3',
            count: 4,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 9030,
              bytes_total: 14030,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
            allowed: 0,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'bbme.blackberry.com',
            count: 19,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 8000,
              bytes_total: 13000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 7,
              },
            ],
            allowed: 17,
            blocked: 0,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'mail.blackberry.com',
            count: 12,
            traffic: {
              bytes_toclient: 1000,
              bytes_toserver: 3500,
              bytes_total: 4500,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
            allowed: 8,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: 'www.blackberry.com',
            count: 4,
            traffic: {
              bytes_toclient: 8700,
              bytes_toserver: 400,
              bytes_total: 9100,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
            allowed: 4,
            blocked: 0,
            maxTsTerm: '1606160728000',
          },
          {
            key: '10.3.8.1',
            count: 12,
            traffic: {
              bytes_toclient: 7000,
              bytes_toserver: 10400,
              bytes_total: 11100,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 3,
              },
            ],
            allowed: 12,
            blocked: 0,
            maxTsTerm: '1606160728000',
          },
          {
            key: '10.3.8.251',
            count: 20,
            traffic: {
              bytes_toclient: 9000,
              bytes_toserver: 25000,
              bytes_total: 34000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
            allowed: 29,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
          {
            key: '11.5.7.251',
            count: 6,
            traffic: {
              bytes_toclient: 8756,
              bytes_toserver: 31000,
              bytes_total: 39756,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
            allowed: 8,
            blocked: 4,
            maxTsTerm: '1606160728000',
          },
        ],
      },
    },
  },
}
