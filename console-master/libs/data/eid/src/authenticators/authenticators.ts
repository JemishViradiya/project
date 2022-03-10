//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { baseUrl } from '../config.rest'
import AuthenticatorsInterface from './authenticators-interface'
import { Authenticator } from './authenticators-types'

const pathPrefix = `${baseUrl}/authenticators`

export const Authenticators: AuthenticatorsInterface = {
  createAuthenticator(authenticator: Authenticator): Response<Authenticator> {
    return UesAxiosClient().post(pathPrefix, authenticator)
  },
  getAuthenticators: async (): Response<Authenticator[]> => {
    const authenticators = await UesAxiosClient().get(pathPrefix)
    // move 'results' EID return to parent 'data'
    if (authenticators) {
      authenticators.data = authenticators?.data?.results ?? undefined
    }
    return authenticators
  },
  getAuthenticatorById(id: string): Response<Authenticator> {
    return UesAxiosClient().get(`${pathPrefix}/${id}`)
  },
  updateAuthenticator(id: string, authenticator: Authenticator): Response<Authenticator> {
    return UesAxiosClient().put(`${pathPrefix}/${id}`, authenticator)
  },
  deleteAuthenticator(id: string): Response<Record<string, unknown>> {
    return UesAxiosClient().delete(`${pathPrefix}/${id}`)
  },
}

export { Authenticator }
export { AuthenticatorsInterface }
