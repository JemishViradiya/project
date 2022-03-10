//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type AuthorizedSoftwareInterface from './authorized-software-interface'
import type { AuthorizedSoftware } from './authorized-software-types'
import { LicenseType } from './authorized-software-types'

const is = 'AuthorizedSoftwareClass'

const authorizedSoftwareMock: AuthorizedSoftware[] = [
  {
    id: '6953faba-ca28-4505-87d6-989ccdcefd38',
    client_ids: ['971c384e-9fef-4929-83c4-b540c794d643'],
    is_use_kerberos_zso: false,
    is_use_mobile_zso: false,
    license_type: LicenseType.BLACKBERRY_INTERNAL,
    scope: '*',
    software_id: 'uem.blackberry',
    tenant_id: 'l50096250',
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: '20ef0c1b-cf40-4bf9-893b-d8b0e9190fa7',
    client_ids: ['971c384e-9fef-4929-83c4-b540c794d643'],
    is_use_kerberos_zso: false,
    is_use_mobile_zso: false,
    license_type: LicenseType.ADMIN_CONSENT,
    scope: '*',
    software_id: 'dave.test.com',
    tenant_id: 'l50096250',
    created: '2020-11-10T15:18:35.000Z',
    last_modified: '2020-11-10T15:18:35.000Z',
  },
]

const AuthorizedSoftwareMock: AuthorizedSoftwareInterface = {
  createAuthorizedSoftware(template: AuthorizedSoftware): Response<AuthorizedSoftware> {
    console.log(`${is}: createAuthorizedSoftware(${[...arguments]})`)
    return Promise.resolve({ data: template })
  },
  getAuthorizedSoftwares(): Response<AuthorizedSoftware[]> {
    console.log(`${is}: getAuthorizedSoftwares(${[...arguments]})`)
    const result = authorizedSoftwareMock
    return Promise.resolve({ data: result })
  },
  getAuthorizedSoftwareById(id: string): Response<AuthorizedSoftware> {
    console.log(`${is}: getAuthorizedSoftwareById(${[...arguments]})`)
    let resp: AuthorizedSoftware
    authorizedSoftwareMock.forEach(auth => {
      if (auth.id === id) {
        resp = auth
      }
    })
    return Promise.resolve({ data: resp })
  },
  updateAuthorizedSoftware(id: string, template: AuthorizedSoftware): Response<AuthorizedSoftware> {
    console.log(`${is}: updateAuthorizedSoftware(${[...arguments]})`)
    return Promise.resolve({ data: template })
  },
  deleteAuthorizedSoftware(id: string): Response<Record<string, unknown>> {
    console.log(`${is}: deleteAuthorizedSoftware(${[...arguments]})`)
    return Promise.resolve({ data: { id, statusCode: 200 } })
  },
}

export { AuthorizedSoftwareMock }
