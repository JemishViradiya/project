//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isNil } from 'lodash-es'

import type { AclRule, AclRuleMatchDefinition } from '@ues-data/gateway'

import { DEFAULT_ACL_RULE } from '../config'
import { AclRuleMatchUIDefinition } from '../types'

export const isDefaultAclRule = (record: AclRule): boolean => record.id === DEFAULT_ACL_RULE.id

export const isNotApplicableMatch = (matchDefinition: Partial<AclRuleMatchDefinition>) => !matchDefinition?.enabled

export const makeMatchUIDefinition = (aclRuleMatch: AclRuleMatchDefinition): AclRuleMatchUIDefinition => {
  if (isEmpty(aclRuleMatch) || aclRuleMatch?.enabled === false) {
    return AclRuleMatchUIDefinition.NotApplicable
  }

  if (aclRuleMatch?.enabled === true && (aclRuleMatch?.negated === false || isNil(aclRuleMatch?.negated))) {
    return AclRuleMatchUIDefinition.MatchesAny
  }

  if (aclRuleMatch?.enabled === true && aclRuleMatch?.negated === true) {
    return AclRuleMatchUIDefinition.DoesNotMatch
  }
}

export const makeMatchDefinition = (selectedMatch: AclRuleMatchUIDefinition): AclRuleMatchDefinition => {
  if (selectedMatch === AclRuleMatchUIDefinition.NotApplicable) {
    return { enabled: false, negated: false }
  }

  if (selectedMatch === AclRuleMatchUIDefinition.MatchesAny) {
    return { enabled: true, negated: false }
  }

  if (selectedMatch === AclRuleMatchUIDefinition.DoesNotMatch) {
    return { enabled: true, negated: true }
  }
}
