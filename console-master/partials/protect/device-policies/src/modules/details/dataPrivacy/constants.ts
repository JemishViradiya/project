import { DataPrivacyField } from '@ues-data/epp'

const DATA_FIELD_ROWS = {
  [DataPrivacyField.hostname]: 'hostnameFQDN',
  [DataPrivacyField.username]: 'username',
  [DataPrivacyField.ipv6]: 'ipAddress',
  [DataPrivacyField.mac_address]: 'macAddress',
  [DataPrivacyField.distinguished_name]: 'distinguishedName',
  [DataPrivacyField.active_directory_information]: 'activeDirectory',
  [DataPrivacyField.file_owner]: 'fileOwner',
  [DataPrivacyField.file_path]: 'filePath',
}

export { DATA_FIELD_ROWS }
