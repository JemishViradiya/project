//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface NetworkServiceEntity {
  id: string
  name: string
  tenantId?: string
  fqdns?: string[]
  ipRanges?: string[]
  snis?: string[]
}
