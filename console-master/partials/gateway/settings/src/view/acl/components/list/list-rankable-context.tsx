//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { createContext } from 'react'

import type { AclRule, AclRuleRank } from '@ues-data/gateway'

export interface AclRankableListContextState {
  onRankChange?: (args: { fromIndex: number; toIndex: number; inputChange?: boolean }) => void
  localRankChange?: { rankUpdate?: Record<string, AclRuleRank>; dataUpdate?: AclRule[] }
}

export const AclRankableListContext = createContext<AclRankableListContextState>({})
