//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceTunnelAggResponse } from '../../types'
import { ReportingServiceNetworkRouteType } from '../../types'

export const topNetworkDestinationsMock: Record<
  ReportingServiceNetworkRouteType.Private | ReportingServiceNetworkRouteType.Public,
  ReportingServiceTunnelAggResponse
> = {
  [ReportingServiceNetworkRouteType.Private]: {
    tenant: {
      tunnelAgg: {
        buckets: [
          {
            key: 'local-dev-ues.cylance.com',
            count: 12,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 253,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
          },
          {
            key: 'bbme.blackberry.com',
            count: 19,
            traffic: {
              bytes_toclient: 7000,
              bytes_toserver: 8040,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 4,
              },
            ],
          },
          {
            key: 'mail.blackberry.com',
            count: 12,
            traffic: {
              bytes_toclient: 18800,
              bytes_toserver: 34500,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 9,
              },
            ],
          },
          {
            key: 'appname1',
            count: 4,
            traffic: {
              bytes_toclient: 4500,
              bytes_toserver: 12050,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 5,
              },
            ],
          },
          {
            key: '11.3.8.1',
            count: 12,
            traffic: {
              bytes_toclient: 5800,
              bytes_toserver: 30450,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
          {
            key: '11.2.7.25',
            count: 6,
            traffic: {
              bytes_toclient: 4756,
              bytes_toserver: 34500,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
        ],
      },
    },
  },
  [ReportingServiceNetworkRouteType.Public]: {
    tenant: {
      tunnelAgg: {
        buckets: [
          {
            key: 'Office365',
            count: 12,
            traffic: {
              bytes_toclient: 100,
              bytes_toserver: 150,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 3,
              },
            ],
          },
          {
            key: 'cylance.com',
            count: 10,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 253,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
          },
          {
            key: 'appname2',
            count: 4,
            traffic: {
              bytes_toclient: 1000,
              bytes_toserver: 20000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
          {
            key: 'appname3',
            count: 4,
            traffic: {
              bytes_toclient: 5000,
              bytes_toserver: 9030,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
          {
            key: 'www.blackberry.com',
            count: 4,
            traffic: {
              bytes_toclient: 8700,
              bytes_toserver: 400,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
          {
            key: '10.3.8.1',
            count: 12,
            traffic: {
              bytes_toclient: 7000,
              bytes_toserver: 10400,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 3,
              },
            ],
          },
          {
            key: '10.3.8.251',
            count: 20,
            traffic: {
              bytes_toclient: 9000,
              bytes_toserver: 25000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 2,
              },
            ],
          },
          {
            key: '11.5.7.251',
            count: 6,
            traffic: {
              bytes_toclient: 8756,
              bytes_toserver: 31000,
            },
            fieldCounts: [
              {
                field: 'EcoId',
                count: 1,
              },
            ],
          },
        ],
      },
    },
  },
}
