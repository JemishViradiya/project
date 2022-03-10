//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared-types'

import type PolicyInterface from './policy-interface'
import type { Policy } from './policy-types'
import { RISK } from './policy-types'

const is = 'PolicyClass'

export const policyMock: Policy[] = [
  {
    id: '9906e78b-4ccc-4080-8b6c-fd2367c45d02',
    name: 'Policy A',
    description: 'Test policy A description',
    authenticators: {
      '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
      '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
    },
    risk_factors: {
      name: 'BFS',
      authenticators: {
        '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
      },
      risks: [RISK.browser_first_seen],
      rule: { '==': [{ var: 'browser_first' }, true] },
    },
    exceptions: [
      {
        software_id: 'uem.blackberry',
        name: 'BlackBerry UEM',
        authenticators: {
          '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
      {
        software_id: 'dave.test.com',
        name: 'DAC App1',
        authenticators: {
          '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
    ],
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: '11981ec4-f154-435a-9df9-11da7b966f7f',
    name: 'Policy B',
    description: 'Test policy B description',
    authenticators: {
      '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
      '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
    },
    risk_factors: {
      name: 'BFS',
      authenticators: {
        '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
      },
      risks: [RISK.browser_first_seen],
      rule: { '==': [{ var: 'browser_first' }, true] },
    },
    exceptions: [
      {
        software_id: 'uem.blackberry',
        name: 'BlackBerry UEM',
        authenticators: {
          '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
      {
        software_id: 'dave.test.com',
        name: 'DAC App1',
        authenticators: {
          '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
    ],
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: '74fadb2f-efb7-4ab1-a0f4-c4d0ad7cfc68',
    name: 'Policy C',
    description: 'Test policy C description',
    authenticators: {
      '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
      '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
    },
    risk_factors: {
      name: 'BFS',
      authenticators: {
        '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
      },
      risks: [RISK.browser_first_seen],
      rule: { '==': [{ var: 'browser_first' }, true] },
    },
    exceptions: [
      {
        software_id: 'uem.blackberry',
        name: 'BlackBerry UEM',
        authenticators: {
          '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
      {
        software_id: 'dave.test.com',
        name: 'DAC App1',
        authenticators: {
          '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
    ],
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
  {
    id: 'c4216e55-f9b4-4af8-915b-dbcf1671b16c',
    name: 'Policy D',
    description: 'Test policy D description',
    authenticators: {
      '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
      '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
    },
    risk_factors: {
      name: 'BFS',
      authenticators: {
        '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
      },
      risks: [RISK.browser_first_seen],
      rule: { '==': [{ var: 'browser_first' }, true] },
    },
    exceptions: [
      {
        software_id: 'uem.blackberry',
        name: 'BlackBerry UEM',
        authenticators: {
          '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
      {
        software_id: 'dave.test.com',
        name: 'DAC App1',
        authenticators: {
          '1': ['36e43f74-1250-41de-a632-3683a1a88658'],
          '2': ['5109e9f3-0788-4ada-8fcd-3bb64b36b611'],
        },
        risk_factors: {
          name: 'BFS',
          authenticators: {
            '1': ['f612f2a2-79ff-434e-9a2f-3814844c3fd7'],
          },
          risks: [RISK.browser_first_seen],
          rule: { '==': [{ var: 'browser_first' }, true] },
        },
      },
    ],
    created: '2020-09-18T17:05:36.000Z',
    last_modified: '2020-09-18T17:05:36.000Z',
  },
]

const PolicyMock: PolicyInterface = {
  createPolicy(policy: Policy): Response<Policy> {
    console.log(`${is}: createPolicy(${[...arguments]})`)
    return Promise.resolve({ data: policy })
  },
  getPolicies(): Response<Policy[]> {
    console.log(`${is}: getPolicies(${[...arguments]})`)
    const result = policyMock
    return Promise.resolve({ data: result })
  },
  getPolicyById(id: string): Response<Policy> {
    console.log(`${is}: getPolicyById(${[...arguments]})`)
    let resp: Policy
    policyMock.forEach(auth => {
      if (auth.id === id) {
        resp = auth
      }
    })
    return Promise.resolve({ data: resp })
  },
  updatePolicy(id: string, policy: Policy): Response<Policy> {
    console.log(`${is}: updatePolicy(${[...arguments]})`)
    return Promise.resolve({ data: policy })
  },
  deletePolicy(id: string): Response<Record<string, unknown>> {
    console.log(`${is}: deletePolicy(${[...arguments]})`)
    return Promise.resolve({ data: { id, statusCode: 200 } })
  },
}

export { PolicyMock }
