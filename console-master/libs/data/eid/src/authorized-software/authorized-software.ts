//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { baseUrl } from '../config.rest'
import AuthorizedSoftwareInterface from './authorized-software-interface'
import { AuthorizedSoftware } from './authorized-software-types'

const pathPrefix = `${baseUrl}/authorized-software`

export const AuthorizedSoftwareProcessor: AuthorizedSoftwareInterface = {
  createAuthorizedSoftware(template: AuthorizedSoftware): Response<AuthorizedSoftware> {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    throw new Error('Method not implemented.')
  },
  getAuthorizedSoftwares: async (): Response<AuthorizedSoftware[]> => {
    const res = await UesAxiosClient().get(pathPrefix)
    // move 'results' EID return to parent 'data'
    if (res) {
      res.data = res?.data?.results ?? undefined
    }
    return res
  },
  getAuthorizedSoftwareById(id: string): Response<AuthorizedSoftware> {
    throw new Error('Method not implemented.')
  },
  updateAuthorizedSoftware(id: string, template: AuthorizedSoftware): Response<AuthorizedSoftware> {
    throw new Error('Method not implemented.')
  },
  deleteAuthorizedSoftware(id: string): Response<Record<string, unknown>> {
    throw new Error('Method not implemented.')
  },
}

export { AuthorizedSoftware }
export { AuthorizedSoftwareInterface }
