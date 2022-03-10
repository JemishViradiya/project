import type { CsvRecordFailure } from '../../../types'
import type { IDeveloperCertificate } from './dev-certs-api-types'

const MOCK_TENANT_GUID = '3d55abd2-c00e-4f5f-abcf-01c92ac777b1'
export const MOCK_IDENTIFIER_FOR_EDIT = 'someIdentifier'

export const devCertsMockData: IDeveloperCertificate[] = [
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    name: 'Approved developer certificate 1',
    platform: 'IOS',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    identifier: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    subject: 'Mock approved subject 1',
    issuer: 'Mock approved issuer 1',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    source: 'MANUAL',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a129',
    name: 'Approved developer certificate 2',
    platform: 'ANDROID',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    identifier: 'e4b1c014-d37c-4890-94c0-7953e717a129',
    subject: 'Mock approved subject 2',
    issuer: 'Mock approved issuer 2',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    source: 'MANUAL',
  },
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e535',
    name: 'Facebook as restricted',
    platform: 'IOS',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    identifier: 'e9a2b066-d37c-4890-94c0-7953e717e535',
    subject: 'Mock restricted subject 1',
    issuer: 'Mock restricted issuer 1',
    description: 'Lorem Ipsum is simply dummy text of the printing some other',
    source: 'MANUAL',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a128',
    name: 'Gmail as restricted',
    platform: 'ANDROID',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    identifier: 'e4b1c014-d37c-4890-94c0-7953e717a128',
    subject: 'Mock restricted subject 2',
    issuer: 'Mock restricted issuer 2',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    source: 'MANUAL',
  },
]

export const failureMockData: CsvRecordFailure[] = [
  {
    recordNumber: 1,
    errorInfo: {
      subStatusCode: 111,
      message: 'message',
      params: [],
    },
  },
]
