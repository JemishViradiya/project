//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type TOTPInterface from './totp-interface'
import type { TOTP } from './totp-types'

const is = 'TOTPClass'

const totpMock: TOTP[] = [
  {
    eecoid: 'c5fab0ca-b94b-4ae7-91d1-3c4dbdec99b0',
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    eecoid: 'a80bf740-7dc3-4815-8572-265bf0065d48',
    activated: false,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    eecoid: '138c20ca-566b-40cb-a110-e93581462dd1',
    activated: true,
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
]

// maps ecs user id to user eecoid
const mapEcsUIdToEecoid = {
  'dXNlcklkLTI=': 'c5fab0ca-b94b-4ae7-91d1-3c4dbdec99b0',
  'dXNlcklkLTM=': 'a80bf740-7dc3-4815-8572-265bf0065d48',
  'dXNlcklkLTE=': '138c20ca-566b-40cb-a110-e93581462dd1',
}

const TOTPMock: TOTPInterface = {
  getTOTPEnrollmentStatus(ecsUserId: string): Response<TOTP> {
    console.log(`${is}: getTOTPEnrollmentStatus(${[...arguments]})`)
    const eecoid = mapEcsUIdToEecoid[ecsUserId]
    let resp: TOTP
    totpMock.forEach(totp => {
      if (totp.eecoid === eecoid) {
        resp = totp
      }
    })
    return Promise.resolve({ data: resp })
  },
  removeTOTPEnrollmentStatus(ecsUserId: string): Response<Record<string, unknown>> {
    console.log(`${is}: removeTOTPEnrollmentStatus(${[...arguments]})`)
    return Promise.resolve({ data: { ecsUserId, statusCode: 204 } })
  },
}

export { TOTPMock }
