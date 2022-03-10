//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, omit } from 'lodash-es'

import { serializeParams, UesSessionApi } from '@ues-data/shared'
import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, baseUrl } from '../../config.rest'
import type { PageableRequestParams } from '../common-types'
import type AclInterface from './acl-interface'
import type {
  AclCategoryDefinition,
  AclCommitDraftRequestParams,
  AclCreateDraftRequestParams,
  AclRule,
  AclRuleRank,
  AclRulesProfile,
} from './acl-types'
import categories from './categories.json'

interface MakeUrlFnArgs {
  tenantId?: string
  entityId?: string
  params?: PageableRequestParams<{ userId?: string; ruleId?: string }> | AclCommitDraftRequestParams | AclCreateDraftRequestParams
}

type MakeUrlFn = (args: MakeUrlFnArgs) => string

export const ACL_PROFILE_ENDPOINT_PART = '/profile'
export const ACL_RULES_ENDPOINT_PART = '/rules'
export const ACL_DRAFT_ENDPOINT_PART = '/draft'

export const makeAclBaseEndpointPart = (tenantId: string): string => `/policy/v3/${tenantId}/acl`
export const makeSerializedParams = (params: Record<string, any>): string => (isEmpty(params) ? '' : `?${serializeParams(params)}`)
export const makeEntityIdEndpointPart = (entityId: string): string => (entityId ? `/${entityId}` : '')
const makeAclDraftRequiredRequestParams = (args: MakeUrlFnArgs): MakeUrlFnArgs => {
  const userId = UesSessionApi.getSession()?.data?.userId
  return { ...args, params: { ...args.params, userId: btoa(userId) } }
}

export const makeAclEndpoint = (args: MakeUrlFnArgs, resourceEndpointPart = ''): string =>
  `${makeAclBaseEndpointPart(args.tenantId)}${resourceEndpointPart}${makeEntityIdEndpointPart(args.entityId)}${makeSerializedParams(
    args.params,
  )}`

export const makeAclDraftEndpoint: MakeUrlFn = args =>
  makeAclEndpoint(makeAclDraftRequiredRequestParams(args), ACL_DRAFT_ENDPOINT_PART)
export const makeAclDraftRulesEndpoint: MakeUrlFn = args =>
  makeAclEndpoint(makeAclDraftRequiredRequestParams(args), `${ACL_DRAFT_ENDPOINT_PART}${ACL_RULES_ENDPOINT_PART}`)
export const makeAclDraftProfileEndpoint: MakeUrlFn = args =>
  makeAclEndpoint(makeAclDraftRequiredRequestParams(args), `${ACL_DRAFT_ENDPOINT_PART}${ACL_PROFILE_ENDPOINT_PART}`)

export const makeAclCommittedRulesEndpoint: MakeUrlFn = args => makeAclEndpoint(args, ACL_RULES_ENDPOINT_PART)
export const makeAclCommittedProfileEndpoint: MakeUrlFn = args => makeAclEndpoint(args, ACL_PROFILE_ENDPOINT_PART)
export const makeAclCommittedRuleMappingEndpoint: MakeUrlFn = args =>
  `${makeAclEndpoint(omit(args, ['params']), ACL_RULES_ENDPOINT_PART)}${ACL_DRAFT_ENDPOINT_PART}${makeSerializedParams(
    makeAclDraftRequiredRequestParams(args).params,
  )}`

const makeAclRule = (endpoint: string): string => `${baseUrl}${endpoint}`

class AclClass implements AclInterface {
  readCommittedRules(tenantId: string, params?: PageableRequestParams): Response<PagableResponse<AclRule>> {
    return axiosInstance().get(makeAclRule(makeAclCommittedRulesEndpoint({ tenantId, params })))
  }

  readDraftRules(tenantId: string, params?: PageableRequestParams): Response<PagableResponse<AclRule>> {
    return axiosInstance().get(makeAclRule(makeAclDraftRulesEndpoint({ tenantId, params })))
  }

  readCommittedRulesProfile(tenantId: string): Response<AclRulesProfile> {
    return axiosInstance().get(makeAclRule(makeAclCommittedProfileEndpoint({ tenantId })))
  }

  readDraftRulesProfile(tenantId: string): Response<AclRulesProfile> {
    return axiosInstance().get(makeAclRule(makeAclDraftProfileEndpoint({ tenantId })))
  }

  readCommittedRule(tenantId: string, entityId: string): Response<AclRule> {
    return axiosInstance().get(makeAclRule(makeAclCommittedRulesEndpoint({ tenantId, entityId })))
  }

  readDraftRule(tenantId: string, entityId: string): Response<AclRule> {
    return axiosInstance().get(makeAclRule(makeAclDraftRulesEndpoint({ tenantId, entityId })))
  }

  createDraftRule(tenantId: string, data: Partial<AclRule>): Response<{ id: string }> {
    return axiosInstance().post(makeAclRule(makeAclDraftRulesEndpoint({ tenantId })), data)
  }

  updateDraftRule(tenantId: string, entityId: string, data: Partial<AclRule>): Response {
    return axiosInstance().put(makeAclRule(makeAclDraftRulesEndpoint({ tenantId, entityId })), data)
  }

  removeDraftRule(tenantId: string, entityId: string): Response {
    return axiosInstance().delete(makeAclRule(makeAclDraftRulesEndpoint({ tenantId, entityId })))
  }

  createDraft(tenantId: string, data?: Partial<AclRulesProfile>): Response {
    return axiosInstance().post(makeAclRule(makeAclDraftEndpoint({ tenantId, params: { version: data.version } })))
  }

  commitDraft(tenantId: string, params?: AclCommitDraftRequestParams): Response {
    return axiosInstance().put(makeAclRule(makeAclDraftEndpoint({ tenantId, params })))
  }

  discardDraft(tenantId: string): Response {
    return axiosInstance().delete(makeAclRule(makeAclDraftEndpoint({ tenantId })))
  }

  updateDraftRulesRank(tenantId: string, data?: AclRuleRank[]): Response {
    return axiosInstance().patch(makeAclRule(makeAclDraftRulesEndpoint({ tenantId })), data)
  }

  readDraftRuleFromCommittedRule(tenantId: string, entityId: string): Response<AclRule> {
    return axiosInstance().get(makeAclRule(makeAclCommittedRuleMappingEndpoint({ tenantId, entityId })))
  }

  readCategories(_tenantId: string): Response<AclCategoryDefinition[]> {
    return Promise.resolve({ data: categories.data })
  }
}

const Acl = new AclClass()

export { Acl }
