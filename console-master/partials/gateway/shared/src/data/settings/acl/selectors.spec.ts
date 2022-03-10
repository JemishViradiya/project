//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import * as selectors from './selectors'
import { ReduxSlice } from './types'
import { committedAclRulesMock, AclRule } from '@ues-data/gateway'

const aclRuleMock = committedAclRulesMock[0]

describe(`${ReduxSlice} selectors`, () => {
  describe('getIsAclRuleDefinitionValid', () => {
    it('should return false when destination definition is invalid', () => {
      const testCase = {
        [ReduxSlice]: {
          ui: {
            localAclRuleData: {
              ...aclRuleMock,
              criteria: { ...aclRuleMock.criteria, destination: { enabled: true, targetSet: [], networkServices: [] } },
            } as AclRule,
          },
        },
      }

      expect(selectors.getIsAclRuleDefinitionValid(testCase)).toStrictEqual(false)
    })

    it('should return false when selector definition is invalid', () => {
      const testCase = {
        [ReduxSlice]: {
          ui: {
            localAclRuleData: {
              ...aclRuleMock,
              criteria: { ...aclRuleMock.criteria, selector: { enabled: true, conjunctions: [] } },
            } as AclRule,
          },
        },
      }

      expect(selectors.getIsAclRuleDefinitionValid(testCase)).toStrictEqual(false)
    })

    it('should return false when categories definition is invalid', () => {
      const testCase = {
        [ReduxSlice]: {
          ui: {
            localAclRuleData: {
              ...aclRuleMock,
              criteria: { ...aclRuleMock.criteria, categorySet: { enabled: true, categories: [] } },
            } as AclRule,
          },
        },
      }

      expect(selectors.getIsAclRuleDefinitionValid(testCase)).toStrictEqual(false)
    })

    it('should return true when all acl rule definitions are valid', () => {
      const testCase = {
        [ReduxSlice]: {
          ui: {
            localAclRuleData: aclRuleMock,
          },
        },
      }

      expect(selectors.getIsAclRuleDefinitionValid(testCase)).toStrictEqual(true)
    })
  })
})
