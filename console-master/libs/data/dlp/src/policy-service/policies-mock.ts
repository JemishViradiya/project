//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { Policy, PolicyConfig, PolicyRules, PolicyValue, SearchPattern } from './policies-types'
import {
  ACTION_TYPE,
  ACTIVITY_TYPE,
  CLASSIFICATION,
  CONFIG_TYPE,
  DOMAINS,
  EMAIL_RULE,
  OPERATING_SYSTEM_TYPE,
  POLICY_TYPE,
} from './policies-types'
import type PoliciesInterface from './policy-interface'

const is = 'PoliciesClass'

const policyName = ['Policy lorem', 'Policy ipsum', 'Policy dolor', 'Policy est', 'Policy consectetur']
const n = array => {
  return Math.floor(Math.random() * array.length)
}

const policyRule1: PolicyRules = {
  activity: ACTIVITY_TYPE.ACTIVITY_TYPE_BROWSER_UPLOAD,
  action: ACTION_TYPE.ACTION_TYPE_ALERT,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_ALL,
}
const policyRule2: PolicyRules = {
  activity: ACTIVITY_TYPE.ACTIVITY_TYPE_USB_EXFILTRATE,
  action: ACTION_TYPE.ACTION_TYPE_ALERT,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_ALL,
}
const policyRule3: PolicyRules = {
  activity: ACTIVITY_TYPE.ACTIVITY_TYPE_EMAIL_CLIENTS,
  action: ACTION_TYPE.ACTION_TYPE_ALERT,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_WINDOWS,
}

const policyRule4: PolicyRules = {
  activity: ACTIVITY_TYPE.ACTIVITY_TYPE_SCREEN_CAPTURE,
  action: ACTION_TYPE.ACTION_TYPE_ALERT,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
}

const searchPattern1: SearchPattern = {
  guid: uuidv4(),
  occurrences: 2,
}
const searchPattern2: SearchPattern = {
  guid: uuidv4(),
  occurrences: 3,
}

const policyConfig1: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_COPY_BB_APPS_INTO_NON_BB_APPS,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}

const policyConfig2: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_COPY_NON_BB_APPS_INTO_BB_APPS,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig3: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_DICTATION,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig4: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_INSECURE_VIDEO,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig5: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_SCREEN_RECORDING,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig6: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_KEYBOARDS,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig7: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ADD_WATERMARK,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS,
  enabled: false,
}
const policyConfig8: PolicyConfig = {
  config: CONFIG_TYPE.CONFIG_TYPE_ALLOW_RESTRICTED_MODE,
  osType: OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_ANDROID_GENERIC,
  enabled: false,
}

export const policyValue: PolicyValue = {
  searchPatterns: [searchPattern1, searchPattern2],
  browserDomains: [DOMAINS.DROPBOX, DOMAINS.SHARE_POINT],
  policyRules: [policyRule1, policyRule2, policyRule3],
  policyConfigs: [policyConfig1],
  uploadEvidenceFile: `{"${OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_ALL}": false}`,
  numberOfScreenshots: `{"${OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS}": 5}`,
  emailDomainsRule: EMAIL_RULE.NONE,
  condition: '',
}

const conditionsByURL = isUpdateMode => {
  policyValue.condition = isUpdateMode
    ? '{"and":[{"<":[{"var":"dcf08b0d-a7a8-428b-b881-688adebc27f9"},2]},{"or":[{"<":[{"var":"fffdc656-3584-4bb4-87b7-96c52fd57f91"},2]},{"<":[{"var":"bf17099c-9e18-4515-8f70-8fb09ddf94c7"},2]},{"<":[{"var":"5762e406-e16b-4385-8119-18d16743067b"},2]}]}]}'
    : '{"and":[{">=":[{"var":" "},1]}]}'
  return policyValue
}

export const mobilePolicyValue: PolicyValue = {
  policyRules: [policyRule4],
  policyConfigs: [
    policyConfig1,
    policyConfig2,
    policyConfig3,
    policyConfig4,
    policyConfig5,
    policyConfig6,
    policyConfig7,
    policyConfig8,
  ],
  numberOfScreenshots: { [OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS]: 5 },
  intervalForScreenshots: { [OPERATING_SYSTEM_TYPE.OPERATING_SYSTEM_TYPE_IOS]: 2 },
}

export const policy = (policyType: POLICY_TYPE, subType: CLASSIFICATION, guid: string): Policy => ({
  policyName: policyName[n(policyName)] + ' ' + Math.floor(Math.random() * 100000),
  policyId: guid,
  classification: subType,
  policyType: policyType,
  description: 'General description',
  created: '2021-02-16T09:07:44Z',
  modified: '2021-02-16T09:07:44Z',
  value: JSON.stringify(policyType === POLICY_TYPE.CONTENT ? conditionsByURL(true) : mobilePolicyValue),
})

export const policyTest = (
  policyType: POLICY_TYPE,
  subType: CLASSIFICATION,
  guid: string,
  policyName: string,
  policyDescription: string,
): Policy => ({
  policyName: policyName + ' ' + Math.floor(Math.random() * 100000),
  classification: subType,
  policyType: policyType,
  policyId: guid,
  description: policyDescription + ' ' + Math.floor(Math.random() * 100000),
  created: '2021-02-16T09:07:44Z',
  modified: '2021-02-16T09:07:44Z',
  value: JSON.stringify(policyType === POLICY_TYPE.CONTENT ? conditionsByURL(true) : mobilePolicyValue),
})

export const mockedPolicies: Policy[] = [
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.REGULATORY, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.REGULATORY, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.REGULATORY, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
  // policy(POLICY_TYPE.MOBILE, undefined, uuidv4()),
]

export const mockedPoliciesByGuids: Policy[] = [
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.REGULATORY, 'dcf08b0d-a7a8-428b-b881-688adebc27f9'),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, 'fffdc656-3584-4bb4-87b7-96c52fd57f91'),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.REGULATORY, 'bf17099c-9e18-4515-8f70-8fb09ddf94c7'),
  policy(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, '5762e406-e16b-4385-8119-18d16743067b'),
]

export const policyEntitiesResponse = (
  policyType: POLICY_TYPE,
  params?: PageableSortableQueryParams<Policy>,
): PagableResponse<Policy> => ({
  totals: {
    pages: 1,
    elements: mockedPolicies.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedPolicies.length,
  elements: params ? mockedPolicies.filter(i => i.policyType === policyType).slice(0, params?.max) : mockedPolicies,
})

export const policyByGuidsResponse = (
  guidList: string[],
  params?: PageableSortableQueryParams<Policy>,
): PagableResponse<Policy> => ({
  totals: {
    pages: 1,
    elements: mockedPoliciesByGuids.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: mockedPoliciesByGuids.length,
  elements: mockedPoliciesByGuids
    .filter(policy => policy.policyType === POLICY_TYPE.CONTENT && guidList.includes(policy?.policyId))
    .slice(0, params ? params?.max : undefined),
})

let defaultPolicy = mockedPolicies[0]

class PoliciesMockClass implements PoliciesInterface {
  create(policy: Policy): Response<Partial<Policy> | Policy> {
    console.log(`${is}: create(${[...arguments]})`)
    policy.policyId = uuidv4()
    mockedPolicies.push(policy)
    console.log(`${is}: mock get policies ${JSON.stringify(policy)}`)
    return Promise.resolve({
      data: policy,
    })
  }

  read(policyId: string): Response<Policy | Partial<Policy>> {
    console.log(`${is}: read(${policyId})`)
    const policy: Policy = mockedPolicies.find(element => element.policyId === policyId)
    console.log(`${is}: read policy ${JSON.stringify(policy)}`)
    return Promise.resolve({ data: policy })
  }

  readAll(
    policyType: POLICY_TYPE,
    params?: PageableSortableQueryParams<Policy>,
  ): Response<PagableResponse<Policy> | Partial<PagableResponse<Policy>>> {
    // console.log(`${is}: readAll():  ${JSON.stringify(policyEntitiesResponse(params))}`)

    return Promise.resolve({ data: policyEntitiesResponse(policyType, params) })
  }

  readAllByGuids(
    guidList: string[],
    params?: PageableSortableQueryParams<Policy>,
  ): Response<PagableResponse<Policy> | Partial<PagableResponse<Policy>>> {
    return Promise.resolve({
      data: policyByGuidsResponse(
        mockedPoliciesByGuids.filter(policy => guidList.includes(policy.policyId)).map(policy => policy.policyId),
        params,
      ),
    })
  }

  update(policy: Partial<Policy>): Response<Policy | Partial<Policy>> {
    console.log(`${is}: update(${[...arguments]})`)
    const index = mockedPolicies.findIndex(element => element.policyId === policy.policyId)
    if (index >= 0) {
      mockedPolicies[index] = { ...mockedPolicies[index], ...policy }
      return Promise.resolve({ data: mockedPolicies[index] })
    }
    return Promise.reject({ error: 'PolicyNotFound' })
  }
  remove(policyId: string): Response<unknown> {
    console.log(`${is}: remove(${[...arguments]})`)
    const index = mockedPolicies.findIndex(element => element.policyId === policyId)
    if (index >= 0) {
      if (index === 1) {
        return Promise.reject({
          response: {
            status: 400,
          },
        })
      } else {
        mockedPolicies.splice(index, 1)
        return Promise.resolve({})
      }
    }
    return Promise.reject({ error: 'PolicyNotFound' })
  }
  getPolicySettingDefinition(type: POLICY_TYPE): Response<PolicyValue | Partial<PolicyValue>> {
    console.log(`${is}: getPolicySettingDefinition(${type})`)
    const policyDefinition: PolicyValue = type === POLICY_TYPE.CONTENT ? conditionsByURL(false) : mobilePolicyValue
    console.log(`${is}: getPolicySettingDefinition ${JSON.stringify(policyDefinition)}`)
    return Promise.resolve({ data: policyDefinition })
  }
  //TODO: Get tenant settings used in policy

  getDefaultPolicy(type: POLICY_TYPE): Response<string> {
    console.log(`${is}: getDefaultPolicy(${type})`)
    console.log(`${is}: get default policy ${JSON.stringify(defaultPolicy)}`)
    return Promise.resolve({ data: defaultPolicy.policyId })
  }
  setDefaultPolicy(type: POLICY_TYPE, policyId: string): Response<unknown> {
    console.log(`${is}: setDefaultPolicy(${[...arguments]})`)
    const index = mockedPolicies.findIndex(element => element.policyId === policyId)
    if (index >= 0) {
      defaultPolicy = mockedPolicies[index]
      console.log(`${is}: mock setDefaultPolicy ${JSON.stringify(defaultPolicy)}`)
      return Promise.resolve({})
    }
    return Promise.reject({ error: 'PolicyNotFound' })
  }
}

const PoliciesMockApi = new PoliciesMockClass()

export { PoliciesMockApi }
