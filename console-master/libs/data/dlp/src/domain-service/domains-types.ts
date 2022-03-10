//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export type BrowserDomain = {
  guid?: string
  domain: string
  description: string
  enabled?: string
  certThumbprint: string
  // rootCA: string
  created?: string
  updated?: string
  httpStatusCode?: number
  policiesAssigned?: number
}

export const DOMAIN_DEFAULT = {
  domain: '',
  description: '',
  certThumbprint: '',
}
