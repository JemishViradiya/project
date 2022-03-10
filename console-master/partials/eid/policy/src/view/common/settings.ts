/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export enum SERVER_POLICY_OPERATION {
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum UPDATE_TABS {
  SETTINGS = 'settings',
  USERS_AND_GROUPS = 'usergroups',
}

export enum DIALOG_TYPE {
  AUTHENTICATOR_SELECT = 'authenticatorSelectDialog',
  MANAGED_EXCEPTION_SELECT = 'managedExceptionSelectDialog',
}

export enum VALIDATE_OPERATION {
  AUTHENTICATOR_LIST_CHANGE = 1,
  RISK_FACTORS_CHANGE = 2,
  EXCEPTIONS_CHANGE = 3,
}

export enum ENQUEUE_TYPE {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export enum QUERY_STRING_PARM {
  MODE = 'mode',
  TAB = 'tabId',
}

export enum MODE_PARAM_VALUE {
  COPY = 'copy',
}

export const POLICY_DEFAULTS = {
  name: '',
}
