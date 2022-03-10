//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface PolicyAuthenticator {
  '1': string[]
  '2'?: string[]
  '3'?: string[]
  '4'?: string[]
  '5'?: string[]
  '6'?: string[]
  '7'?: string[]
  '8'?: string[]
  '9'?: string[]
  '10'?: string[]
  '11'?: string[]
  '12'?: string[]
  '13'?: string[]
  '14'?: string[]
  '15'?: string[]
  '16'?: string[]
  '17'?: string[]
  '18'?: string[]
  '19'?: string[]
}

export enum RISK {
  browser_first_seen = 'browser_first_seen',
  outside_office = 'outside_office',
  behavioral_risk = 'behavioral_risk',
  geozone_risk = 'geozone_risk',
}

export interface RiskFactor {
  name: string
  description?: string
  authenticators: PolicyAuthenticator
  risks: RISK[]
  rule: any
}

export interface ExceptionBase {
  software_id: string
  name: string
  description?: string
}

export interface Exception extends ExceptionBase {
  authenticators: PolicyAuthenticator
  risk_factors?: RiskFactor
}

export interface Policy {
  id: string
  name: string
  description?: string
  authenticators: PolicyAuthenticator
  created: string
  last_modified: string
  risk_factors?: RiskFactor
  exceptions?: Exception[]
}
// eslint-disable-next-line no-redeclare
export const Policy = void 0
