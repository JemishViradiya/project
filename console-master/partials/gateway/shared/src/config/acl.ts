//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type {
  AclRule,
  AclRuleCategorySet,
  AclRuleDestination,
  AclRuleDisposition,
  AclRuleRiskRange,
  AclRuleSelector,
  PageableRequestParams,
} from '@ues-data/gateway'
import { AclRuleDispositionAction } from '@ues-data/gateway'
import { TableSortDirection } from '@ues/behaviours'

export const DEFAULT_LIST_QUERY_PARAMS_MAX = 20
export const DEFAULT_LIST_QUERY_PARAMS_LIMIT = 1000
export const DEFAULT_LIST_QUERY_PARAMS_SORT_BY = 'rank'
export const DEFAULT_LIST_QUERY_PARAMS_SORT_DIR = TableSortDirection.Asc
export const DEFAULT_LIST_QUERY_PARAMS: PageableRequestParams = {
  offset: 0,
  max: DEFAULT_LIST_QUERY_PARAMS_MAX,
  sortBy: `${DEFAULT_LIST_QUERY_PARAMS_SORT_BY} ${DEFAULT_LIST_QUERY_PARAMS_SORT_DIR}`,
}

export const DEFAULT_ACL_RULE_DISPOSITION_ALLOW_DATA: AclRuleDisposition = {
  action: AclRuleDispositionAction.Allow,
  applyBlockGatewayList: true,
}

export const DEFAULT_ACL_RULE_DISPOSITION_BLOCK_DATA: AclRuleDisposition = {
  action: AclRuleDispositionAction.Block,
  notify: false,
}

export const DEFAULT_ACL_RULE_SELECTOR_DATA: AclRuleSelector = {
  enabled: false,
  negated: false,
  conjunctions: [],
}

export const DEFAULT_ACL_RULE_CATEGORY_SET_DATA: AclRuleCategorySet = {
  enabled: false,
  negated: false,
  categories: [],
}

export const DEFAULT_ACL_RULE_RISK_RANGE_DATA: AclRuleRiskRange = {
  enabled: false,
  min: 0,
  max: 0,
}

export const DEFAULT_ACL_RULE_DESTINATION_DATA: AclRuleDestination = {
  enabled: false,
  negated: false,
  ignorePort: false,
}

export const DEFAULT_ACL_RULE_DATA = {
  enabled: true,
  criteria: {
    destination: DEFAULT_ACL_RULE_DESTINATION_DATA,
    selector: DEFAULT_ACL_RULE_SELECTOR_DATA,
    categorySet: DEFAULT_ACL_RULE_CATEGORY_SET_DATA,
    riskRange: DEFAULT_ACL_RULE_RISK_RANGE_DATA,
  },
  disposition: DEFAULT_ACL_RULE_DISPOSITION_ALLOW_DATA,
} as AclRule

export const DEFAULT_ACL_RULE = {
  id: 'default',
  name: 'Default',
  enabled: true,
  rank: undefined,
  disposition: { action: AclRuleDispositionAction.Block },
} as AclRule

export const DEFAULT_ACL_RULES_COUNT = 1
