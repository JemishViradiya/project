import type { RiskLevelTypes } from '@ues-data/bis/model'

export enum PolicyFormField {
  Name = 'name',
  Description = 'description',
  PolicyData = 'policyData',
}

export interface PolicyIdentityRiskFixUp {
  enabled: boolean
  minimumBehavioralRiskLevel: RiskLevelTypes
  actionPauseDuration: number
}

export interface PolicyAction {
  actionType: string
  pillarTypeId: string
  actionAttributes: {
    entityId: string
  }
}

export interface PolicyRiskLevelActions {
  level: RiskLevelTypes
  actions: PolicyAction[]
}

export interface PolicyIdentityRiskConfiguration {
  riskFactors: string[]
  fixUp: PolicyIdentityRiskFixUp
  riskLevelActions: PolicyRiskLevelActions[]
}

export interface PolcyGeozoneRiskConfiguration {
  riskFactors: []
}

export interface PolicyData {
  identityPolicy: PolicyIdentityRiskConfiguration
  geozonePolicy: PolcyGeozoneRiskConfiguration
}

export interface PolicyFormValues {
  [PolicyFormField.Name]: string
  [PolicyFormField.Description]: string
  [PolicyFormField.PolicyData]: PolicyData
}

export interface PolicyCreatorLocationState {
  copiedValues?: PolicyFormValues
}
