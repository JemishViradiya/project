//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { MetadataQueryVariables } from './device-os-version'

export const queryDeviceBrandsGpl = gql`
  query Metadata($osFamily: String!) {
    deviceBrands(osFamily: $osFamily)
      @rest(type: "MtdDeviceModels", path: "/mtd/v1/device-metadata/hardwarebrands?osFamily={args.osFamily}", method: "GET") {
      name: string
      vendor: vendor
    }
  }
`

export const queryDeviceBrandsMock = {
  deviceBrands: [
    { name: '10', vendor: { name: 'htc' } },
    { name: '10 evo', vendor: { name: 'htc' } },
    { name: '306SH', vendor: { name: 'Sharp' } },
    { name: '360 N4S', vendor: { name: 'QiKU' } },
    { name: '5.1', vendor: { name: 'NOKIA' } },
    { name: 'A1', vendor: { name: 'Gionee' } },
    { name: 'A2019 Pro', vendor: { name: 'ZTE' } },
    { name: 'A2019G Pro', vendor: { name: 'ZTE' } },
    { name: 'A3', vendor: { name: 'TCT (Alcatel)' } },
    { name: 'A33f', vendor: { name: 'Oppo' } },
    { name: 'A368t', vendor: { name: 'Lenovo' } },
    { name: 'A369i', vendor: { name: 'Lenovo' } },
    { name: 'A37f', vendor: { name: 'Oppo' } },
    { name: 'A5', vendor: { name: 'Lenovo' } },
    { name: 'A52', vendor: { name: 'Oppo' } },
    { name: 'A536', vendor: { name: 'Lenovo' } },
    { name: 'A5500-HV', vendor: { name: 'Lenovo' } },
    { name: 'A57', vendor: { name: 'Oppo' } },
    { name: 'A6000', vendor: { name: 'Lenovo' } },
    { name: 'A72', vendor: { name: 'Oppo' } },
    { name: 'A889', vendor: { name: 'Lenovo' } },
    { name: 'ADVANCE 4.0 L2', vendor: { name: 'Blu' } },
    { name: 'ADVANCE 5.0 HD', vendor: { name: 'Blu' } },
    { name: 'ALCATEL ONETOUCH IDOL 3', vendor: { name: 'TCT (Alcatel)' } },
    { name: 'AQUOS R2', vendor: { name: 'Sharp' } },
    { name: 'AQUOS R3', vendor: { name: 'Sharp' } },
    { name: 'AQUOS ZETA SH-01H', vendor: { name: 'Sharp' } },
    { name: 'AQUOS sense lite (SH-M05)', vendor: { name: 'Sharp' } },
  ],
}

export const queryDeviceBrands: ApolloQuery<any, MetadataQueryVariables> = {
  mockQueryFn: () => queryDeviceBrandsMock,
  query: queryDeviceBrandsGpl,
  context: getApolloQueryContext(APOLLO_DESTINATION.REST_API),
  permissions: NoPermissions,
}
