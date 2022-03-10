//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { AuthorizedSoftware } from './authorized-software-types'

// ToDo: Actually document interface
export default interface AuthorizedSoftwareInterface {
  /**
   * Creates a new software template
   * @param template The new software template config
   */
  createAuthorizedSoftware(template: AuthorizedSoftware): Response<AuthorizedSoftware>

  /**
   * Get all software templates
   */
  getAuthorizedSoftwares(): Response<Array<AuthorizedSoftware>>

  getAuthorizedSoftwareById(id: string): Response<AuthorizedSoftware>
  updateAuthorizedSoftware(id: string, authenticator: AuthorizedSoftware): Response<AuthorizedSoftware>
  deleteAuthorizedSoftware(id: string): Response<Record<string, unknown>>
}
