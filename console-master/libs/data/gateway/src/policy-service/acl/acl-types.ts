//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServiceEntityPartial, TargetSet } from '../common-types'

export enum AclRuleDispositionAction {
  Allow = 'allow',
  Block = 'block',
}

export enum AclRuleSelectorProperty {
  User = 'user',
  UserGroup = 'group',
}

export interface AclRuleMatchDefinition {
  enabled?: boolean
  negated?: boolean
}

export interface AclRuleDisposition {
  action: AclRuleDispositionAction
  applyBlockGatewayList?: boolean
  message?: string
  notify?: boolean
  privacy?: boolean
}

export interface AclRuleRiskRange extends Pick<AclRuleMatchDefinition, 'enabled'> {
  min?: number
  max?: number
}

export interface AclRuleDestination extends AclRuleMatchDefinition {
  ignorePort?: boolean
  networkServices?: NetworkServiceEntityPartial[]
  targetSet?: TargetSet[]
}

export interface AclRuleSelectorConjunctionTerm {
  negated: boolean
  propertySelector: {
    property: AclRuleSelectorProperty
    values: string[]
  }
}

export interface AclRuleSelector extends AclRuleMatchDefinition {
  conjunctions?: AclRuleSelectorConjunctionTerm[][]
}

export interface AclRuleCategory {
  id: string
  subcategories?: string[]
}

export interface AclRuleCategorySet extends AclRuleMatchDefinition {
  categories?: AclRuleCategory[]
}

export interface AclRule {
  id: string
  name: string
  metadata?: { description?: string }
  enabled: boolean
  rank: number
  criteria?: {
    categorySet?: AclRuleCategorySet
    destination?: AclRuleDestination
    riskRange?: AclRuleRiskRange
    selector?: AclRuleSelector
  }
  disposition?: AclRuleDisposition
}

export interface AclCommitDraftRequestParams {
  force?: true
}

export type AclCreateDraftRequestParams = Pick<AclRulesProfile, 'version'>

export interface AclRulesProfile {
  version?: number
  updated?: number
  updatedBy?: string
  blockListsMessage?: string
}

export interface AclRuleRank {
  rank: number
  id: string
}

export interface AclCategoryDefinitionPartial {
  id: string
  name: string
}

export interface AclCategoryDefinition extends AclCategoryDefinitionPartial {
  subcategories: AclCategoryDefinitionPartial[]
}
