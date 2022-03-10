import type { CsvRecordFailure } from '../../../types'
import type { IAppInfo } from './applications-api-types'

export const MOCK_TENANT_GUID = '3d55abd2-c00e-4f5f-abcf-01c92ac777b1'
export const MOCK_APP_HASH_FOR_EDIT = '524CCFC0AA021DB152783FFFAE35774471468C6508A56E313C35CB954F026B73'

export const apps: IAppInfo[] = [
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    name: 'Facebook',
    platform: 'IOS',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    hash: 'D160560AD3D5B8815A985BEA8552E98A2DEB8E88F2D833364AE009104E41BBB1',
    vendorName: 'Facebook Inc.',
    version: '1.2.2',
    versionCode: 'v1.1',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    source: 'MANUAL',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a129',
    name: 'Gmail',
    platform: 'ANDROID',
    type: 'APPROVED',
    tenantGuid: MOCK_TENANT_GUID,
    hash: 'D160560AD3D5B8815A985BEA8552E98A2DEB8E88F2D833364AE009104E41BBB2',
    vendorName: 'Google Inc.',
    version: '5.9',
    versionCode: 'v6.1',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    source: 'MANUAL',
  },
  {
    guid: 'e9a2b066-d37c-4890-94c0-7953e717e535',
    name: 'Facebook as restricted',
    platform: 'IOS',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    hash: 'D160560AD3D5B8815A985BEA8552E98A2DEB8E88F2D833364AE009104E41BBB3',
    vendorName: 'Facebook Inc.',
    version: '1.2.2',
    versionCode: 'v1.1',
    description: 'Lorem Ipsum is simply dummy text of the printing some other',
    source: 'MANUAL',
  },
  {
    guid: 'e4b1c014-d37c-4890-94c0-7953e717a128',
    name: 'Gmail as restricted',
    platform: 'ANDROID',
    type: 'RESTRICTED',
    tenantGuid: MOCK_TENANT_GUID,
    hash: 'D160560AD3D5B8815A985BEA8552E98A2DEB8E88F2D833364AE009104E41BBB4',
    vendorName: 'Google Inc.',
    version: '5.9',
    versionCode: 'v6.1',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    source: 'MANUAL',
  },
]

export const failure: CsvRecordFailure[] = [
  {
    recordNumber: 1,
    errorInfo: {
      subStatusCode: 111,
      message: 'message',
      params: [],
    },
  },
]
