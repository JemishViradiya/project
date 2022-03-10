//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { AclRuleDispositionAction, AclRuleSelectorProperty } from '@ues-data/gateway'
import { Types } from '@ues-gateway/shared'

const { AclRuleMatchUIDefinition } = Types

export const DISPOSITION_LOCALIZATION_KEYS = {
  [AclRuleDispositionAction.Allow]: 'common.allow',
  [AclRuleDispositionAction.Block]: 'common.block',
}

export const MATCHES_LOCALIZATION_KEYS = {
  [AclRuleMatchUIDefinition.MatchesAny]: 'acl.matchesAny',
  [AclRuleMatchUIDefinition.DoesNotMatch]: 'acl.doesNotMatch',
  [AclRuleMatchUIDefinition.NotApplicable]: 'acl.notApplicable',
}

export const SELECTOR_PROPERTY_LOCALIZATION_KEYS = {
  [AclRuleSelectorProperty.User]: 'common.user',
  [AclRuleSelectorProperty.UserGroup]: 'common.userGroup',
}
