import { Permission } from '@ues-data/shared-types'

import {
  APPS_API_URL,
  CERTS_API_URL,
  RESTRICTED_APPS_UI_URL,
  RESTRICTED_CERTS_UI_URL,
  RESTRICTED_DOMAINS_UI_URL,
  RESTRICTED_IP_UI_URL,
  SAFE_APPS_UI_URL,
  SAFE_CERTS_UI_URL,
  SAFE_DOMAINS_UI_URL,
  SAFE_IP_UI_URL,
  WEB_ADDRESS_API_URL,
} from './constants'
import { ADDRESS_TYPE_HOST, ADDRESS_TYPE_IP, SORT_BY_CREATED_DESC, TYPE_APPROVED, TYPE_RESTRICTED } from './util-domains'

export const permissionsSet = {
  grantDelete: [
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: false,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: false,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: true,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: true,
    },
  ],
  deleteForbidden: [
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: false,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: false,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: true,
    },
    {
      [Permission.VENUE_SETTINGSGLOBALLIST_READ]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_DELETE]: false,
      [Permission.VENUE_SETTINGSGLOBALLIST_CREATE]: true,
      [Permission.VENUE_SETTINGSGLOBALLIST_UPDATE]: true,
    },
  ],
}

export const getShortenPermissionsNames = (permissionsSetGroup): string[] => {
  return Object.keys(permissionsSetGroup).map((permissionKey, index, array) => {
    let shortName = permissionsSetGroup[permissionKey] ? '+' : '-'
    switch (permissionKey) {
      case Permission.VENUE_SETTINGSGLOBALLIST_READ:
        shortName += 'READ'
        break
      case Permission.VENUE_SETTINGSGLOBALLIST_CREATE:
        shortName += 'CREATE'
        break
      case Permission.VENUE_SETTINGSGLOBALLIST_UPDATE:
        shortName += 'UPDATE'
        break
      case Permission.VENUE_SETTINGSGLOBALLIST_DELETE:
        shortName += 'DELETE'
        break
    }
    return shortName
  })
}

export const entityTypeSetupData = {
  restricted_domain: {
    ui_url: RESTRICTED_DOMAINS_UI_URL,
    api_url: WEB_ADDRESS_API_URL,
    query: `type=${TYPE_RESTRICTED},addressType=${ADDRESS_TYPE_HOST}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98665927 - [Domain][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98668266 - [Domain][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  safe_domain: {
    ui_url: SAFE_DOMAINS_UI_URL,
    api_url: WEB_ADDRESS_API_URL,
    query: `type=${TYPE_APPROVED},addressType=${ADDRESS_TYPE_HOST}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98665927 - [Domain][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98668266 - [Domain][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  restricted_ip: {
    ui_url: RESTRICTED_IP_UI_URL,
    api_url: WEB_ADDRESS_API_URL,
    query: `type=${TYPE_RESTRICTED},addressType=${ADDRESS_TYPE_IP}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete:
        'C98634170 - [IP Address][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create) ',
      deleteForbidden:
        "C98659471 - [IP Address][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  safe_ip: {
    ui_url: SAFE_IP_UI_URL,
    api_url: WEB_ADDRESS_API_URL,
    query: `type=${TYPE_APPROVED},addressType=${ADDRESS_TYPE_IP}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete:
        'C98634170 - [IP Address][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create) ',
      deleteForbidden:
        "C98659471 - [IP Address][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  restricted_app: {
    ui_url: RESTRICTED_APPS_UI_URL,
    api_url: APPS_API_URL,
    query: `type=${TYPE_RESTRICTED}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98634171 - [Apps][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98635804 - [Apps][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  safe_app: {
    ui_url: SAFE_APPS_UI_URL,
    api_url: APPS_API_URL,
    query: `type=${TYPE_APPROVED}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98634171 - [Apps][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98635804 - [Apps][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  restricted_dev_cert: {
    ui_url: RESTRICTED_CERTS_UI_URL,
    api_url: CERTS_API_URL,
    query: `type=${TYPE_RESTRICTED}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98659481	- [Cert][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98660186 - [Cert][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
  safe_dev_cert: {
    ui_url: SAFE_CERTS_UI_URL,
    api_url: CERTS_API_URL,
    query: `type=${TYPE_APPROVED}`,
    sortBy: SORT_BY_CREATED_DESC,
    itTitle: {
      grantDelete: 'C98659481	- [Cert][Delete] Read + Delete permissions exists (in any combination with Edit and/or Create)',
      deleteForbidden:
        "C98660186 - [Cert][No Delete] Delete permission doesn't exist (with any combination with Read and/or Edit and/or Create)",
    },
  },
}

export const entityTypesList = [
  'restricted_domain',
  'safe_domain',
  'restricted_ip',
  'safe_ip',
  'restricted_app',
  'safe_app',
  'restricted_dev_cert',
  'safe_dev_cert',
]
