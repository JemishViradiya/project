import { ApplicationsApi as Applications } from './applications/applications-api'
import { ApprovedApplicationsApiMock, RestrictedApplicationsApiMock } from './applications/applications-api-mock'
import { queryApplicationsForExport } from './applications/query'
import { DeveloperCertificatesApi as DeveloperCertificates } from './dev-certs/dev-certs-api'
import { ApprovedDeveloperCertificatesApiMock, RestrictedDeveloperCertificatesApiMock } from './dev-certs/dev-certs-api-mock'
import { queryDevCertsForExport } from './dev-certs/query'
import { queryDomainsForExport, queryWebAddressesForExport } from './web-addresses/query'
import { WebAddressesApi as WebAddresses } from './web-addresses/web-addresses-api'
import {
  ApprovedDomainsApiMock,
  ApprovedIPAddressesApiMock,
  RestrictedDomainsApiMock,
  RestrictedIPAddressesApiMock,
} from './web-addresses/web-addresses-api-mock'

const IMPORT_TIMEOUT_IN_MILLISECONDS = 180000

const MtdApi = {
  Applications,
  DeveloperCertificates,
  WebAddresses,
}

const MtdApiMock = {
  Applications: ApprovedApplicationsApiMock,
  DeveloperCertificates: ApprovedDeveloperCertificatesApiMock,
  WebAddresses: ApprovedIPAddressesApiMock,
}

const MtdApiRestrictedMock = {
  Applications: RestrictedApplicationsApiMock,
  DeveloperCertificates: RestrictedDeveloperCertificatesApiMock,
  WebAddresses: RestrictedIPAddressesApiMock,
}

const MtdApiApprovedForDomainMock = { ...MtdApiMock, WebAddresses: ApprovedDomainsApiMock }

const MtdApiRestrictedForDomainMock = { ...MtdApiRestrictedMock, WebAddresses: RestrictedDomainsApiMock }

const Queries = {
  queryApplicationsForExport,
  queryDevCertsForExport,
  queryWebAddressesForExport,
  queryDomainsForExport,
}

export {
  IMPORT_TIMEOUT_IN_MILLISECONDS,
  MtdApi,
  MtdApiMock,
  MtdApiRestrictedMock,
  MtdApiApprovedForDomainMock,
  MtdApiRestrictedForDomainMock,
  Queries,
}
export * from './common-types'
export * from './applications/applications-api-types'
export * from './dev-certs/dev-certs-api-types'
export * from './web-addresses/web-addresses-api-types'
