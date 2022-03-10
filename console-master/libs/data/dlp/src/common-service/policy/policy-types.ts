import type { PolicyService } from './policy-service'

export enum POLICY_SETTING_TYPE {
  BROWSER = 'BROWSER',
}

export type PolicyDomainReference = {
  reference: string
  usedInPolicies?: string[]
}

export type PolicyCommonApiProvider = typeof PolicyService
