//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type AuthenticatorsInterface from './authenticators-interface'
import type { Authenticator } from './authenticators-types'
import { AuthenticationType, SigningType } from './authenticators-types'

const is = 'AuthenticatorsClass'

export const authenticatorsMock: Authenticator[] = [
  {
    id: '36e43f74-1250-41de-a632-3683a1a88658',
    name: 'Okta Sales',
    description: 'This okta authenticator is for sales',
    type: AuthenticationType.OKTA,
    configuration: {
      discovery_url: 'https://message-testnet-admin.okta.com/.well-known/openid-configuration',
      client_authentication: {
        client_id: '0oa28shftTs0C4PSh5d6',
        jwks: {},
        id_token_signed_response_alg: SigningType.RS256,
      },
    },
    created: '2021-02-11T20:14:21.000Z',
    last_modified: '2021-02-11T20:14:21.000Z',
  },
  {
    id: '5109e9f3-0788-4ada-8fcd-3bb64b36b611',
    name: 'Main Enterprise',
    description: 'This is the main enterprise authenticator with UEM/UES',
    type: AuthenticationType.ENTERPRISE,
    created: '2021-02-11T20:12:29.000Z',
    last_modified: '2021-02-11T20:12:29.000Z',
  },
  {
    id: '6209e9f3-0788-4ada-8fcd-3bb64b36b611',
    name: 'AD Authenticator',
    description: 'This is the AD internal authenticator',
    type: AuthenticationType.AD,
    created: '2021-02-11T20:12:29.000Z',
    last_modified: '2021-02-11T20:12:29.000Z',
  },
  {
    id: '7209e9f3-0788-4ada-8fcd-3bb64b36b611',
    name: 'LDAP Authenticator',
    description: 'This is the LDAP internal authenticator',
    type: AuthenticationType.LDAP,
    created: '2021-02-11T20:12:29.000Z',
    last_modified: '2021-02-11T20:12:29.000Z',
  },
  {
    id: '8209e9f3-0788-4ada-8fcd-3bb64b36b611',
    name: 'CUR Authenticator',
    description: 'This is the CUR internal authenticator',
    type: AuthenticationType.CUR,
    created: '2021-02-11T20:12:29.000Z',
    last_modified: '2021-02-11T20:12:29.000Z',
  },
  {
    id: '9209e9f3-0788-4ada-8fcd-3bb64b36b611',
    name: 'VENUE Authenticator',
    description: 'This is the VENUE authenticator',
    type: AuthenticationType.VENUE,
    created: '2021-02-11T20:12:29.000Z',
    last_modified: '2021-02-11T20:12:29.000Z',
  },
  {
    id: 'd48d8e19-9633-4888-8ff1-1574a3d981b9',
    name: 'Ping',
    description: 'Ping auth for all users',
    type: AuthenticationType.PING,
    configuration: {
      discovery_url: 'https://message-testnet-admin.okta.com/.well-known/openid-configuration',
      client_authentication: {
        client_id: '0oa28shftTs0C4PSh5d6',
        jwks: {},
        id_token_signed_response_alg: SigningType.ES384,
      },
    },
    created: '2021-02-11T20:15:21.000Z',
    last_modified: '2021-02-11T20:15:21.000Z',
  },
  {
    id: 'f612f2a2-79ff-434e-9a2f-3814844c3fd7',
    name: 'Okta Development',
    description: 'This okta authenticator is for developers',
    type: AuthenticationType.OKTA,
    configuration: {
      discovery_url: 'https://message-testnet-admin.okta.com/.well-known/openid-configuration',
      client_authentication: {
        client_id: '0oa28shftTs0C4PSh5d6',
        jwks: {},
        id_token_signed_response_alg: SigningType.RS256,
      },
    },
    created: '2021-02-11T20:14:44.000Z',
    last_modified: '2021-02-11T20:14:44.000Z',
  },
  {
    id: '814a7fdc-9bfa-4d41-9fb7-0cc4f718b0a5',
    name: 'Okta MFA',
    description: 'Sample okta mfa authenticator',
    type: AuthenticationType.OKTA_MFA,
    configuration: {
      auth_api_key: 'authKey001',
      auth_domain: 'test.com',
    },
    created: '2021-02-11T20:14:44.000Z',
    last_modified: '2021-02-11T20:14:44.000Z',
  },
  {
    id: 'd6dafea6-e54f-4c3e-ae4b-6084e42616c1',
    name: 'TOTP Test',
    type: AuthenticationType.TOTP,
    configuration: {
      window: 2,
    },
    created: '2021-02-11T20:14:44.000Z',
    last_modified: '2021-02-11T20:14:44.000Z',
  },
]

class AuthenticatorsClass implements AuthenticatorsInterface {
  createAuthenticator(authenticator: Authenticator): Response<Authenticator> {
    console.log(`${is}: createAuthenticator(${[...arguments]})`)
    const result = authenticator
    return Promise.resolve({ data: result })
  }
  getAuthenticators(): Response<Authenticator[]> {
    console.log(`${is}: getAuthenticators(${[...arguments]})`)
    const result = authenticatorsMock
    return Promise.resolve({ data: result })
  }
  getAuthenticatorById(id: string): Response<Authenticator> {
    console.log(`${is}: getAuthenticatorById(${[...arguments]})`)
    let resp: Authenticator
    authenticatorsMock.forEach(auth => {
      if (auth.id === id) {
        resp = auth
      }
    })
    return Promise.resolve({ data: resp })
  }
  updateAuthenticator(id: string, authenticator: Authenticator): Response<Authenticator> {
    console.log(`${is}: updateAuthenticator(${[...arguments]})`)
    return Promise.resolve({ data: authenticator })
  }
  deleteAuthenticator(id: string): Response<Record<string, unknown>> {
    console.log(`${is}: deleteAuthenticator(${[...arguments]})`)
    return Promise.resolve({ data: { id, statusCode: 200 } })
  }
  // searchUsers(tenantId: string, search: string): Response<DirectoryUser[]> {
  //   console.log(`${is}: searchUsers(${[...arguments]})`)

  //   // directoryMock.find(function (directoryUser, index) {
  //   //   if (directoryUser.displayName.includes(search) || directoryUser.emailAddress.includes(search)) return directoryUser
  //   // })
  //   return Promise.resolve({ data: directoryMock })
  // }
}

const AuthenticatorsMock = new AuthenticatorsClass()

export { AuthenticatorsMock }
