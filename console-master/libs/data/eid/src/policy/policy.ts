//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { baseUrl } from '../config.rest'
import PolicyInterface from './policy-interface'
import { Policy } from './policy-types'

const pathPrefix = `${baseUrl}/authentication-policies`

export const PolicyProcessor: PolicyInterface = {
  createPolicy(policy: Policy): Response<Policy> {
    return UesAxiosClient().post(pathPrefix, policy)
  },
  getPolicies(): Response<Policy[]> {
    return UesAxiosClient().get(pathPrefix)
  },
  getPolicyById(id: string): Response<Policy> {
    return UesAxiosClient().get(`${pathPrefix}/${id}`)
  },
  updatePolicy(id: string, policy: Policy): Response<Policy> {
    return UesAxiosClient().put(`${pathPrefix}/${id}`, policy)
  },
  deletePolicy(id: string): Response<Record<string, unknown>> {
    return UesAxiosClient().delete(`${pathPrefix}/${id}`)
  },
}

export { Policy }
export { PolicyInterface }
