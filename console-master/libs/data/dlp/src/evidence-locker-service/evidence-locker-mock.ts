//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type EvidenceLockerInterface from './evidence-locker-interface'
import type { EvidenceLockerBase } from './evidence-locker-types'

export const mockedEvidenceLockerList: EvidenceLockerBase[] = [
  {
    fileName: 'Product Planning.pptx',
    fileHash: 'd38cba4ec9054785988bbacc56b5587e',
    size: 789,
    created: '2021-01-22T20:15:04Z',
  },
  {
    fileName: 'Quarterly Budget.xlsx',
    fileHash: 'a327fca35c3541fabb4a05932c86aced',
    size: 1234,
    created: '2021-02-22T20:17:04Z',
  },
  {
    fileName: 'Employee Comp.docx',
    fileHash: '3c4afecf66f04cdcb1b4f2574ef53b45',
    size: 324,
    created: '2021-03-22T20:19:04Z',
  },
]

export const EvidenceLockerResponse = (
  params?: PageableSortableQueryParams<EvidenceLockerBase>,
): PagableResponse<EvidenceLockerBase> => ({
  totals: {
    pages: 1,
    elements: mockedEvidenceLockerList.length,
  },
  count: mockedEvidenceLockerList.length,
  elements: params ? mockedEvidenceLockerList.slice(0, params?.offset) : mockedEvidenceLockerList,
})

class EvidenceLockerMockClass implements EvidenceLockerInterface {
  readAll(
    params?: PageableSortableQueryParams<EvidenceLockerBase>,
  ): Response<PagableResponse<EvidenceLockerBase> | Partial<PagableResponse<EvidenceLockerBase>>> {
    return Promise.resolve({ data: EvidenceLockerResponse(params) })
  }
}

const EvidenceLockerMockApi = new EvidenceLockerMockClass()

export { EvidenceLockerMockApi }
