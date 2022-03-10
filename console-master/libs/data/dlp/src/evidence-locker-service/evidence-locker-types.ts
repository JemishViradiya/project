//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface EvidenceLockerBase {
  fileName: string
  fileHash: string
  size: number
  created: string
}

export type EvidenceLockerQueryParams = {
  query?: string
  offset?: number
  max?: number
  sortBy?: string
}
