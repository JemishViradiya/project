/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

export enum WARNING_NOTIFICATION_INTERVAL {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

export enum TYPE {
  GENERAL = 'GENERAL',
}

export enum SERVER_OPERATION {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// TODO moved to the Policy model
export const POLICY_DEFAULTS = {
  policyName: '',
  description: 'no description',
}

export const GENERAL_DEFAULT = {
  domain: '',
  description: '',
  certThumbprint: '',
}

export const TEMPLATE_DEFAULT = {
  templateName: '',
  region: '',
  dataTypeIncluded: '',
  source: '',
}

export const DATATYPES_DEFAULT = {
  templateName: '',
  region: '',
  informationType: 'None',
  searchMethod: 'KeywordSearch',
  source: '',
  searchMethodOptions: [
    {
      value: 'KeywordSearch',
      label: 'Keyword Search',
    },
    {
      value: 'RegularExpression',
      label: 'Regular Expression',
    },
  ],
  informationTypeOptions: [
    {
      value: 'Health',
      label: 'Health',
    },
    {
      value: 'Finance',
      label: 'Finance',
    },
  ],
}
