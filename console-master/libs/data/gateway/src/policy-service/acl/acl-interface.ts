//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared'

import type { PageableRequestParams } from '../common-types'
import type { AclCommitDraftRequestParams, AclRule, AclRuleRank, AclRulesProfile } from './acl-types'

export default interface AclInterface {
  /**
   * Get committed acl rules for this tenant
   * @param tenantId The tenant id of the customer
   * @param params The request params
   */
  readCommittedRules(tenantId: string, params: PageableRequestParams): Response<PagableResponse<AclRule>>

  /**
   * Get acl rules draft for this tenant
   * @param tenantId The tenant id of the customer
   * @param params The request params
   */
  readDraftRules(tenantId: string, params: PageableRequestParams): Response<PagableResponse<AclRule>>

  /**
   * Get committed acl rules version for this tenant
   * @param tenantId The tenant id of the customer
   */
  readCommittedRulesProfile(tenantId: string): Response<AclRulesProfile>

  /**
   * Get acl rules draft version for this tenant
   * @param tenantId The tenant id of the customer
   */
  readDraftRulesProfile(tenantId: string): Response<AclRulesProfile>

  /**
   * Get the committed acl rule data
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   */
  readCommittedRule(tenantId: string, entityId: string): Response<AclRule>

  /**
   * Get the acl rule data from draft
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   */
  readDraftRule(tenantId: string, entityId: string): Response<AclRule>

  /**
   * Creates a new acl rule into draft for this tenant
   * @param tenantId The tenant id of the customer
   * @param data The initial acl rule data
   */
  createDraftRule(tenantId: string, data: Partial<AclRule>): Response<{ id: string }>

  /**
   * Updates the acl rule from draft
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   * @param data The updated entity data
   */
  updateDraftRule(tenantId: string, entityId: string, data: Partial<AclRule>): Response

  /**
   * Deletes the acl rule from draft
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   */
  removeDraftRule(tenantId: string, entityId: string): Response

  /**
   * Creates the acl rules draft
   * @param tenantId The tenant id of the customer
   * @param data The profile data
   */
  createDraft(tenantId: string, data: Partial<AclRulesProfile>): Response

  /**
   * Commits the acl draft as the new applied tenant ACL
   * @param tenantId The tenant id of the customer
   * @param params The request params
   */
  commitDraft(tenantId: string, params: AclCommitDraftRequestParams): Response

  /**
   * Discards the acl draft
   * @param tenantId The tenant id of the customer
   */
  discardDraft(tenantId: string): Response

  /**
   * Retrieves the draft ACL rule in this user's draft ACL that maps to the specified committed rule.
   * @param tenantId The tenant id of the customer
   * @param entityId The committed rule id
   */
  readDraftRuleFromCommittedRule(tenantId: string, entityId: string): Response<AclRule>

  /**
   * Updates the rank of the rules in this user's draft ACL.
   * @param tenantId The tenant id of the customer
   * @param data The new ranks update data
   */
  updateDraftRulesRank(tenantId: string, data: AclRuleRank[]): Response
}
