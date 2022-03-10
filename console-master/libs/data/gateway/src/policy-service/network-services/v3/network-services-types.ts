//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServiceEntityPartial, PageableRequestParams, TargetSet } from '../../common-types'

export interface NetworkServiceEntity {
  id?: string
  name: string
  metadata?: { description?: string }
  tenantId?: string
  snis?: string[]
  networkServices?: NetworkServiceEntityPartial[]
  targetSet?: TargetSet[]
}

export type NetworkServicesRequestParams = PageableRequestParams<{ intrinsic?: boolean }>
