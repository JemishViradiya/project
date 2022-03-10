//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { UesAxiosClient } from '@ues-data/shared'
import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, deviceBaseUrl, policyBaseUrl } from '../config.rest'
import type { PageableSortableQueryParams } from '../types'
import type { Policy, POLICY_TYPE, PolicyValue } from './policies-types'
import type PoliciesInterface from './policy-interface'

export const makePolicyEndpoint = (urlPart?: string): string => (urlPart ? `${urlPart}` : ``)

export const makePolicyUrl = (urlPart?: string): string => `${policyBaseUrl}/${makePolicyEndpoint(urlPart)}`
export const makeDeviceUrl = (urlPart?: string): string => `${deviceBaseUrl}/${makePolicyEndpoint(urlPart)}`

class PoliciesClass implements PoliciesInterface {
  create(policy: Policy): Response<Partial<Policy> | Policy> {
    return axiosInstance().post(makePolicyUrl(), policy)
  }
  read(policyId: string): Response<Policy | Partial<Policy>> {
    return axiosInstance().get(makePolicyUrl(policyId))
  }
  readAll(
    policyType: POLICY_TYPE,
    params?: PageableSortableQueryParams<Policy>,
  ): Response<PagableResponse<Policy> | Partial<PagableResponse<Policy>>> {
    const response: Response<Partial<PagableResponse<Policy>>> = axiosInstance().get(makePolicyUrl(`policies/${policyType}`), {
      params: params,
    })
    console.log('Policy API, readAll = ', response)
    return response
  }
  readAllByGuids(
    guidList: string[],
    params?: PageableSortableQueryParams<Policy>,
  ): Response<PagableResponse<Policy> | Partial<PagableResponse<Policy>>> {
    const response: Response<Partial<PagableResponse<Policy>>> = axiosInstance().post(makePolicyUrl(`policies/byGuids`), guidList, {
      params: params,
    })
    console.log('Policy API, readAllByGuids = ', response)
    return response
  }
  update(policy: Partial<Policy>): Response<Policy | Partial<Policy>> {
    return axiosInstance().patch(makePolicyUrl(policy.policyId), policy)
  }
  remove(policyId: string): Response<unknown> {
    return axiosInstance().delete(makePolicyUrl(policyId))
  }
  getPolicySettingDefinition(type: POLICY_TYPE): Response<PolicyValue | Partial<PolicyValue>> {
    return axiosInstance().get(makePolicyUrl(`definition/${type}`))
  }
  getDefaultPolicy(type: POLICY_TYPE): Response<string> {
    return axiosInstance().get(makeDeviceUrl(`defaultPolicy/${type}`))
  }
  setDefaultPolicy(type: POLICY_TYPE, policyId: string): Response<string> {
    return axiosInstance().put(makeDeviceUrl(`defaultPolicy/${type}/${policyId}`))
  }
}

const PoliciesApi = new PoliciesClass()

export { PoliciesApi }
