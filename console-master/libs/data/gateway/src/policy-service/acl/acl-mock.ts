//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import * as httpStatus from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'
import { makePageableResponse } from '@ues-data/shared-types'

import type { PageableRequestParams } from '../common-types'
import { RequestError, TargetSetPortProtocol } from '../common-types'
import type AclInterface from './acl-interface'
import type { AclCategoryDefinition, AclCommitDraftRequestParams, AclRule, AclRuleRank, AclRulesProfile } from './acl-types'
import { AclRuleDispositionAction, AclRuleSelectorProperty } from './acl-types'
import categories from './categories.json'

export let committedAclRulesMock: AclRule[] = [
  {
    id: '48a210bb-d13b-4c93-8f3b-391dae43bd13',
    rank: 1,
    name: 'Too risky',
    metadata: {
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 1',
    },
    enabled: true,
    disposition: {
      action: AclRuleDispositionAction.Block,
      notify: true,
      message: 'The message to display on device',
      privacy: true,
    },
    criteria: {
      destination: {
        enabled: true,
        negated: false,
        ignorePort: true,
        networkServices: [
          {
            id: '667dea75-g123-47i5-b34u-2978a66u989d',
            name: 'blackberrysquare',
          },
        ],
      },
      riskRange: {
        enabled: true,
        min: 2,
        max: 3,
      },
      selector: {
        enabled: true,
        negated: false,
        conjunctions: [
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['997dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
            {
              negated: true,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['17dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['857dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['457dea75-g123-47i5-b34u-2978a66u989d', '107dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
            {
              negated: true,
              propertySelector: {
                property: AclRuleSelectorProperty.User,
                values: ['597dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
        ],
      },
    },
  },
  {
    id: '48a210bb-d13b-4c93-8f3b-391dae43bd14',
    rank: 2,
    name: 'Quick trusted access',
    metadata: {
      description: 'Test 2',
    },
    enabled: false,
    disposition: {
      action: AclRuleDispositionAction.Block,
    },
    criteria: {
      destination: {
        enabled: true,
        negated: false,
        networkServices: [
          {
            id: '123dea75-g123-47i5-b93u-2914a66u209x',
            name: 'Social media',
          },
          {
            id: '123dea75-g123-47i5-b93u-8524a66u209z',
            name: 'Google',
          },
          {
            id: '667dea75-g123-47i5-b34u-2978a66u989d',
            name: 'blackberrysquare',
          },
        ],
        targetSet: [
          {
            addressSet: ['10.0.0.0/24'],
            portSet: [
              {
                protocol: TargetSetPortProtocol.TCP,
                min: 5,
                max: 20,
              },
              {
                protocol: TargetSetPortProtocol.TCPorUDP,
                min: 5,
                max: 23,
              },
              {
                protocol: TargetSetPortProtocol.UDP,
                min: 5,
                max: 30,
              },
            ],
          },
        ],
      },
      riskRange: {
        enabled: true,
        min: 1,
        max: 1,
      },
      selector: {
        enabled: true,
        negated: false,
        conjunctions: [
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['117dea76-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['958dea75-g123-47i8-b34u-2978a66u949d', '107dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
            {
              negated: true,
              propertySelector: {
                property: AclRuleSelectorProperty.User,
                values: ['597dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
        ],
      },
    },
  },
  {
    id: '48a210bb-d13b-4c93-8f3b-391dae43bd15',
    rank: 3,
    name: 'No facebook',
    metadata: {
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 3',
    },
    enabled: false,
    disposition: {
      action: AclRuleDispositionAction.Allow,
      applyBlockGatewayList: true,
    },
    criteria: {
      destination: {
        enabled: true,
        negated: true,
        networkServices: [
          {
            id: '123dea75-g123-47i5-b93u-2914a66u209x',
            name: 'Social media',
          },
          {
            id: '667dea75-g123-47i5-b34u-9878a66u989e',
            name: 'GIT',
          },
        ],
        targetSet: [
          {
            addressSet: ['10.0.0.0/24'],
            portSet: [
              {
                protocol: TargetSetPortProtocol.TCP,
                min: 5,
                max: 20,
              },
              {
                protocol: TargetSetPortProtocol.TCPorUDP,
                min: 5,
                max: 23,
              },
              {
                protocol: TargetSetPortProtocol.UDP,
                min: 5,
                max: 30,
              },
            ],
          },
        ],
      },
      riskRange: {
        enabled: true,
        min: 3,
        max: 3,
      },
      selector: {
        enabled: true,
        negated: false,
        conjunctions: [
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: ['117dea76-g123-47i5-b34u-2978a66u989d', '457dea75-g123-47i5-b34u-2978a66u989d'],
              },
            },
          ],
        ],
      },
    },
  },
  {
    id: '48a210bb-d13b-4c93-8f3b-391dae43bd17',
    rank: 4,
    name: 'Public Internet',
    metadata: {
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 4',
    },
    enabled: true,
    disposition: {
      action: AclRuleDispositionAction.Block,
    },
    criteria: {
      destination: {
        enabled: false,
      },
      riskRange: {
        enabled: true,
        min: 1,
        max: 2,
      },
      selector: {
        enabled: true,
        negated: false,
        conjunctions: [
          [
            {
              negated: false,
              propertySelector: {
                property: AclRuleSelectorProperty.UserGroup,
                values: [
                  '457dea75-g123-47i5-b34u-2978a66u989d',
                  '958dea75-g123-47i8-b34u-2978a66u949d',
                  '117dea76-g123-47i5-b34u-2978a66u989d',
                ],
              },
            },
          ],
          [
            {
              negated: true,
              propertySelector: {
                property: AclRuleSelectorProperty.User,
                values: ['127xte76-g123-47i5-b34u-2978a66u989x', '218wea75-g123-47i8-b34u-2978a66u949y'],
              },
            },
          ],
        ],
      },
    },
  },
]

export let draftAclRulesMock: AclRule[] = []

export let draftAclRulesProfileMock: AclRulesProfile = {}

export let committedAclRulesProfileMock: AclRulesProfile = {
  version: 1,
  blockListsMessage: 'Blocked by default lists',
}

const VALUE_GETTER = {
  description: item => item.metadata.description,
  name: item => item.name,
  rank: item => item.rank,
}

const findRecordIndex = (mockData: AclRule[], entityId: string) => mockData.findIndex(record => record.id === entityId)

const findRecord = (mockData: AclRule[], entityId: string) => mockData.find(record => record.id === entityId)

const removeRecord = (mockData: AclRule[], entityId: string) => {
  const recordIndex = findRecordIndex(mockData, entityId)

  mockData.splice(recordIndex, 1)
}

const updateRecordsRank = (mockData: AclRule[]) => {
  if (mockData.length > 0) {
    mockData.forEach((_, index) => (mockData[index].rank = index + 1))
  }
}

const clearDraft = () => {
  draftAclRulesMock = []
  draftAclRulesProfileMock = {}
}

/**
 * This flag enables conflict with already existing draft.
 */
const BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_EXISTS_KEY = 'BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_EXISTS'
/**
 * This flag enables conflict with not existing draft
 * (it means that you don’t have saved draft on the server and before you do any write operation to draft,
 * you need to create draft with pulling the latest committed acl as a new draft on the server),
 * it can happen when you load app and other admin introduces update to committed acl and on your
 * local env you still have same (now old) version of committed acl which you load when you first enter the app.
 */
const BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_NOT_EXISTS_KEY = 'BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_NOT_EXISTS'

const isNameAlreadyUsedInDraft = (name: string): boolean => {
  const draftAclRulesNames = draftAclRulesMock.map(rule => rule.name)

  return draftAclRulesNames.includes(name)
}

const simulateExistingDraftConflict = () => {
  if (JSON.parse(localStorage.getItem(BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_EXISTS_KEY)) === true) {
    draftAclRulesMock = [{ ...committedAclRulesMock[1] }, { ...committedAclRulesMock[2] }].map((record, index) => ({
      ...record,
      rank: index + 1,
    }))
    committedAclRulesProfileMock = { ...committedAclRulesProfileMock, version: 2 }
    draftAclRulesProfileMock = { ...committedAclRulesProfileMock, version: 1 }
  }
}
simulateExistingDraftConflict()

const sortRules = (data: AclRule[], params: PageableRequestParams) => {
  if (!params.sortBy) return data

  const [sortBy, sortDir] = params.sortBy.split(' ')

  return data.sort((a, b) => {
    const valueA = VALUE_GETTER[sortBy](a)
    const valueB = VALUE_GETTER[sortBy](b)

    const compare = (item, nextItem) => (typeof item === 'string' ? item.localeCompare(nextItem) : item - nextItem)

    return sortDir?.toLowerCase() === 'asc' ? compare(valueA, valueB) : compare(valueB, valueA)
  })
}

const filterRules = (data: AclRule[], params: PageableRequestParams) => {
  if (!params.query) return data

  const queryParams = params.query.split('&')

  return data.filter(item =>
    queryParams.some(queryParam => {
      const [name, value] = queryParam.split('=')
      return VALUE_GETTER[name](item).includes(value.substring(1, value.length - 1))
    }),
  )
}

class AclClass implements AclInterface {
  readCommittedRules(_tenantId: string, _params: PageableRequestParams): Response<PagableResponse<AclRule>> {
    const data = sortRules(filterRules(committedAclRulesMock, _params), _params)

    return Promise.resolve({ data: makePageableResponse(data) })
  }

  readDraftRules(_tenantId: string, _params: PageableRequestParams): Response<PagableResponse<AclRule>> {
    if (!draftAclRulesMock?.length) {
      return Promise.reject({ status: httpStatus.NOT_FOUND })
    }

    const data = sortRules(filterRules(draftAclRulesMock, _params), _params)

    return Promise.resolve({ data: makePageableResponse(data) })
  }

  readCommittedRulesProfile(_tenantId: string): Response<AclRulesProfile> {
    return Promise.resolve({ data: committedAclRulesProfileMock })
  }

  readDraftRulesProfile(_tenantId: string): Response<AclRulesProfile> {
    if (!draftAclRulesProfileMock?.version) {
      return Promise.reject({ status: httpStatus.NOT_FOUND })
    }

    return Promise.resolve({ data: { ...draftAclRulesProfileMock } })
  }

  readCommittedRule(_tenantId: string, entityId: string): Response<AclRule> {
    const record = findRecord(committedAclRulesMock, entityId)

    return Promise.resolve({ data: { ...record } })
  }

  readDraftRule(_tenantId: string, entityId: string): Response<AclRule> {
    const record = findRecord(draftAclRulesMock, entityId)

    return Promise.resolve({ data: { ...record } })
  }

  createDraftRule(_tenantId: string, data: Partial<AclRule>): Response<{ id: string }> {
    if (isNameAlreadyUsedInDraft(data.name)) {
      return Promise.reject({
        response: {
          status: httpStatus.BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    const recordBase = { ...(data as AclRule), id: uuidv4() }

    if (data.rank) {
      draftAclRulesMock.splice(data.rank - 1, 0, { ...recordBase, rank: data.rank })
      updateRecordsRank(draftAclRulesMock)
    } else {
      draftAclRulesMock.push({ ...recordBase, rank: draftAclRulesMock.length + 1 })
    }
    return Promise.resolve({ data: { id: recordBase.id } })
  }

  updateDraftRule(_tenantId: string, entityId: string, data: AclRule): Response {
    const updatableDraftRule = findRecord(draftAclRulesMock, entityId)

    if (data.name !== updatableDraftRule?.name && isNameAlreadyUsedInDraft(data.name)) {
      return Promise.reject({
        response: {
          status: httpStatus.BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    const recordIndex = findRecordIndex(draftAclRulesMock, entityId)

    if (typeof recordIndex === 'number' && draftAclRulesMock[recordIndex]) {
      draftAclRulesMock[recordIndex] = { ...data, id: draftAclRulesMock[recordIndex].id }
    }

    return Promise.resolve({ data: { ...draftAclRulesMock[recordIndex] } })
  }

  removeDraftRule(_tenantId: string, entityId: string): Response {
    removeRecord(draftAclRulesMock, entityId)

    updateRecordsRank(draftAclRulesMock)

    return Promise.resolve({})
  }

  createDraft(_tenantId: string, data?: Partial<AclRulesProfile>): Response {
    if (JSON.parse(localStorage.getItem(BIG_MAKE_CONFLICT_WHEN_ACL_DRAFT_NOT_EXISTS_KEY)) === true) {
      return Promise.reject({
        status: httpStatus.CONFLICT,
        data: { error: 'InvalidVersion' },
      })
    }

    draftAclRulesProfileMock.version = data?.version ?? committedAclRulesProfileMock.version

    draftAclRulesMock = [...committedAclRulesMock]

    return Promise.resolve({})
  }

  commitDraft(_tenantId: string, _params: AclCommitDraftRequestParams): Response {
    committedAclRulesMock = [...draftAclRulesMock]
    committedAclRulesProfileMock.version = committedAclRulesProfileMock.version + 1

    clearDraft()

    return Promise.resolve({})
  }

  discardDraft(_tenantId: string): Response {
    clearDraft()

    return Promise.resolve({})
  }

  readDraftRuleFromCommittedRule(_tenantId: string, entityId: string): Response<AclRule> {
    // TODO update mock
    return Promise.resolve({ data: { id: entityId } as AclRule })
  }

  updateDraftRulesRank(_tenantId: string, _data: AclRuleRank[]): Response<AclRule> {
    // TODO update mock
    return Promise.resolve({})
  }

  readCategories(_tenantId: string): Response<AclCategoryDefinition[]> {
    return Promise.resolve({ data: categories.data })
  }
}

const AclMock = new AclClass()

export { AclMock }
