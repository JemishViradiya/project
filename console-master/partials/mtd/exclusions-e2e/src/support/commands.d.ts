import '@testing-library/cypress/add-commands'

import type { EntitiesPageableResponse, IDeveloperCertificate, IWebAddress } from '@ues-data/mtd'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface ChainableI<Subject = any> {
      login(email: string, password: string): void
      mockRestrictedDomainsGet(
        sortByQueryParam: string,
        httpResponseCode: number,
        responseBody: EntitiesPageableResponse<IWebAddress>,
      ): void
      interceptApprovedDomainsGet(sortBy: string, response: EntitiesPageableResponse<IWebAddress>): any
      interceptRestrictedDomainsGet(sortBy: string, response: EntitiesPageableResponse<IWebAddress>): any
      interceptRestrictedCertsGet(sortBy: string, response: EntitiesPageableResponse<IDeveloperCertificate>): any
      interceptSafeCertsGet(sortBy: string, response: EntitiesPageableResponse<IDeveloperCertificate>): any
      interceptCertificateRequest(method: string, status: int, message: string): any
      interceptEntityListGet(
        url: string,
        query: string,
        sortBy: string,
        response: EntitiesPageableResponse<IDeveloperCertificate | IWebAddress>,
      ): any
    }
  }
}
