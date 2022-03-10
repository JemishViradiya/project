import type { Response } from '@ues-data/shared-types'

import type { Authenticator } from './authenticators-types'

// ToDo: Actually document interface
export default interface AuthenticatorsInterface {
  /**
   * Creates a new authenticator
   * @param authenticator The new authenticator config
   */
  createAuthenticator(authenticator: Authenticator): Response<Authenticator>

  /**
   * Get all authenticators
   */
  getAuthenticators(): Response<Array<Authenticator>>
  getAuthenticatorById(id: string): Response<Authenticator>
  updateAuthenticator(id: string, authenticator: Authenticator): Response<Authenticator>
  deleteAuthenticator(id: string): Response<Record<string, unknown>>
}
