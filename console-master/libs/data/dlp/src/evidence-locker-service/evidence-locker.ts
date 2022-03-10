//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { isEmpty } from 'lodash-es'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, fileBaseUrl } from '../config.rest'
import type { PageableSortableQueryParams } from '../types'
import type EvidenceLockerInterface from './evidence-locker-interface'
import type { EvidenceLockerBase, EvidenceLockerQueryParams } from './evidence-locker-types'

const getEvidenceLockerQueryUrl = (params: EvidenceLockerQueryParams) =>
  Object.keys(params)
    .map(key => (typeof params[key] === 'object' ? `${key}=${params[key].join(',')}` : `${key}=${params[key]}`))
    .join('&')

export const makeEvidenceLockerEndpoint = params => {
  return `${fileBaseUrl}/filesInfo${!isEmpty(params) ? '?' + getEvidenceLockerQueryUrl({ ...params }) : ''}`
}

class EvidenceLockerClass implements EvidenceLockerInterface {
  readAll(
    params?: PageableSortableQueryParams<EvidenceLockerBase>,
  ): Response<PagableResponse<EvidenceLockerBase> | Partial<PagableResponse<EvidenceLockerBase>>> {
    return axiosInstance().get(makeEvidenceLockerEndpoint(params))
  }
}

const EvidenceLockerApi = new EvidenceLockerClass()

export { EvidenceLockerApi }
