import reducer from './reducer'
import { ActionType, ReduxSlice, TaskId } from './types'
import { defaultState } from './reducer'
import { DEFAULT_ACL_RULE_DATA, DEFAULT_ACL_RULE } from '../../../config'
import { AclRule } from '@ues-data/gateway'

describe(`${ReduxSlice} reducer`, () => {
  // [TaskId.FetchDraftAclRules]
  describe(`${ActionType.FetchDraftAclRulesStart}`, () => {
    it(`should set ${TaskId.FetchDraftAclRules} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchDraftAclRulesStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRules]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchDraftAclRulesSuccess}`, () => {
    it(`should set ${TaskId.FetchDraftAclRules} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchDraftAclRulesSuccess,
        payload: {
          response: {
            totals: {
              elements: [],
            },
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ui: {
          ...defaultState.ui,
          localAclRulesData: undefined,
        },
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRules]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchDraftAclRulesError}`, () => {
    it(`should set ${TaskId.FetchDraftAclRules} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchDraftAclRulesError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRules]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.FetchCommittedAclRules
  describe(`${ActionType.FetchCommittedAclRulesStart}`, () => {
    it(`should set ${TaskId.FetchCommittedAclRules} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchCommittedAclRulesStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRules]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchCommittedAclRulesSuccess}`, () => {
    it(`should set ${TaskId.FetchCommittedAclRules} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchCommittedAclRulesSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRules]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchCommittedAclRulesError}`, () => {
    it(`should set ${TaskId.FetchCommittedAclRules} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchCommittedAclRulesError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRules]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.FetchDraftAclRulesProfile]
  describe(`${ActionType.FetchDraftAclRulesProfileStart}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchDraftAclRulesProfileStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRulesProfile]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchDraftAclRulesProfileSuccess}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchDraftAclRulesProfileSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRulesProfile]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchDraftAclRulesProfileError}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchDraftAclRulesProfileError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRulesProfile]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.FetchCommittedAclRulesProfile]
  describe(`${ActionType.FetchCommittedAclRulesProfileStart}`, () => {
    it(`should set ${TaskId.FetchCommittedAclRulesProfile} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchCommittedAclRulesProfileStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRulesProfile]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchCommittedAclRulesProfileSuccess}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchCommittedAclRulesProfileSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRulesProfile]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchCommittedAclRulesProfileError}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchCommittedAclRulesProfileError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchCommittedAclRulesProfile]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.FetchAclRule]
  describe(`${ActionType.FetchAclRuleStart}`, () => {
    it(`should set ${TaskId.FetchAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchAclRuleStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchAclRule]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.FetchAclRuleSuccess}`, () => {
    it(`should set ${TaskId.FetchAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchAclRuleSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          ...previousState.tasks,
          [TaskId.FetchAclRule]: {
            data: action.payload,
            loading: false,
          },
        },
        ui: {
          ...previousState.ui,
          localAclRuleData: {},
        },
      })
    })
  })
  describe(`${ActionType.FetchAclRuleError}`, () => {
    it(`should set ${TaskId.FetchDraftAclRulesProfile} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchAclRuleError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchAclRule]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.AddAclRule]
  describe(`${ActionType.AddAclRuleStart}`, () => {
    it(`should set ${TaskId.AddAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.AddAclRuleStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.AddAclRule]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.AddAclRuleSuccess}`, () => {
    it(`should set ${TaskId.AddAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.FetchAclRuleSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          ...previousState.tasks,
          [TaskId.FetchAclRule]: {
            data: action.payload,
            loading: false,
          },
        },
        ui: {
          ...previousState.ui,
          localAclRuleData: {},
        },
      })
    })
  })
  describe(`${ActionType.AddAclRuleError}`, () => {
    it(`should set ${TaskId.AddAclRule} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.FetchAclRuleError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          fetchAclRule: {
            error,
            loading: false,
          },
        },
      })
    })
  })
  // [TaskId.UpdateAclRule]
  describe(`${ActionType.UpdateAclRuleStart}`, () => {
    it(`should set ${TaskId.UpdateAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdateAclRuleStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.UpdateAclRule]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.UpdateAclRuleSuccess}`, () => {
    it(`should set ${TaskId.UpdateAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdateAclRuleSuccess,
        payload: {
          data: {
            rank: 0,
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchAclRule]: {
            data: {},
            loading: false,
          },
          [TaskId.FetchDraftAclRules]: {
            data: undefined,
            loading: false,
          },
          [TaskId.UpdateAclRule]: {
            data: {
              rank: 0,
            },
            loading: false,
          },
        },
      })
    })
  })
  describe(`${ActionType.UpdateAclRuleError}`, () => {
    it(`should set ${TaskId.UpdateAclRule} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.UpdateAclRuleError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          updateAclRule: {
            error,
            loading: false,
          },
        },
      })
    })
  })
  // [TaskId.DeleteAclRule]
  describe(`${ActionType.DeleteAclRuleStart}`, () => {
    it(`should set ${TaskId.DeleteAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.DeleteAclRuleStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.DeleteAclRule]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.DeleteAclRuleSuccess}`, () => {
    it(`should set ${TaskId.DeleteAclRule} loading state to true`, () => {
      const action: any = {
        type: ActionType.DeleteAclRuleSuccess,
        payload: {
          data: {
            rank: 0,
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchAclRule]: {
            data: {},
            loading: false,
          },
          [TaskId.FetchDraftAclRules]: {
            data: undefined,
            loading: false,
          },
          [TaskId.DeleteAclRule]: {
            data: {
              rank: 0,
            },
            loading: false,
          },
        },
      })
    })
  })
  describe(`${ActionType.DeleteAclRuleError}`, () => {
    it(`should set ${TaskId.DeleteAclRule} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.DeleteAclRuleError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.DeleteAclRule]: {
            error,
            loading: false,
          },
        },
      })
    })
  })
  // [TaskId.UpdateAclRulesRank]
  describe(`${ActionType.UpdateAclRulesRankStart}`, () => {
    it(`should set ${TaskId.UpdateAclRulesRank} loading state to true`, () => {
      const action: any = {
        type: ActionType.UpdateAclRulesRankStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.UpdateAclRulesRank]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.UpdateAclRulesRankSuccess}`, () => {
    it(`should set ${TaskId.UpdateAclRulesRank} loading state to true`, () => {
      const dataBeforeUpdate = [
        {
          name: 'test-rule 2',
          rank: 1,
        },
        {
          name: 'test-rule 1',
          rank: 2,
        },
        DEFAULT_ACL_RULE,
      ] as AclRule[]
      const dataAfterRanksUpdate = [
        {
          name: 'test-rule 1',
          rank: 1,
        },
        {
          name: 'test-rule 2',
          rank: 2,
        },
      ] as AclRule[]
      const action: any = {
        type: ActionType.UpdateAclRulesRankSuccess,
        payload: {
          data: dataAfterRanksUpdate,
        },
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRulesData: dataBeforeUpdate } }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.UpdateAclRulesRank]: {
            data: dataAfterRanksUpdate,
            loading: false,
          },
        },
        ui: {
          ...defaultState.ui,
          localAclRulesData: [...dataAfterRanksUpdate, DEFAULT_ACL_RULE],
        },
      })
    })
  })
  describe(`${ActionType.UpdateAclRulesRankError}`, () => {
    it(`should set ${TaskId.UpdateAclRulesRank} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.UpdateAclRulesRankError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.UpdateAclRulesRank]: {
            error,
            loading: false,
          },
        },
      })
    })
  })
  // [TaskId.CommitDraft]
  describe(`${ActionType.CommitDraftStart}`, () => {
    it(`should set ${TaskId.CommitDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.CommitDraftStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.CommitDraft]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.CommitDraftSuccess}`, () => {
    it(`should set ${TaskId.CommitDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.CommitDraftSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRules]: {
            data: null,
            loading: false,
          },
          [TaskId.FetchDraftAclRulesProfile]: {
            data: null,
            loading: false,
          },
          [TaskId.CommitDraft]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.CommitDraftError}`, () => {
    it(`should set ${TaskId.CommitDraft} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.CommitDraftError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.CommitDraft]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.DiscardDraft]
  describe(`${ActionType.DiscardDraftStart}`, () => {
    it(`should set ${TaskId.DiscardDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.DiscardDraftStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.DiscardDraft]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.DiscardDraftSuccess}`, () => {
    it(`should set ${TaskId.DiscardDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.DiscardDraftSuccess,
        payload: {
          response: {
            elements: [],
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchDraftAclRules]: {
            data: null,
            loading: false,
          },
          [TaskId.FetchDraftAclRulesProfile]: {
            data: null,
            loading: false,
          },
          [TaskId.DiscardDraft]: {
            loading: false,
            data: action.payload,
          },
        },
      })
    })
  })
  describe(`${ActionType.DiscardDraftError}`, () => {
    it(`should set ${TaskId.CommitDraft} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.DiscardDraftError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.DiscardDraft]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.CreateDraft]
  describe(`${ActionType.CreateDraftStart}`, () => {
    it(`should set ${TaskId.DiscardDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.CreateDraftStart,
        payload: {},
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.CreateDraft]: {
            loading: true,
          },
        },
      })
    })
  })
  describe(`${ActionType.CreateDraftSuccess}`, () => {
    it(`should set ${TaskId.CreateDraft} loading state to true`, () => {
      const action: any = {
        type: ActionType.CreateDraftSuccess,
        payload: {
          data: {
            rank: 1,
          },
        },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.CreateDraft]: {
            loading: false,
            data: {
              rank: 1,
            },
          },
          [TaskId.FetchDraftAclRules]: {
            loading: false,
            data: [],
          },
          [TaskId.FetchDraftAclRulesProfile]: {
            loading: false,
            data: undefined,
            error: {},
          },
        },
      })
    })
  })
  describe(`${ActionType.CreateDraftError}`, () => {
    it(`should set ${TaskId.CreateDraft} loading state to true`, () => {
      const error = new Error()
      const action: any = {
        type: ActionType.CreateDraftError,
        payload: { error },
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        tasks: {
          ...defaultState.tasks,
          [TaskId.CreateDraft]: {
            loading: false,
            error: error,
          },
        },
      })
    })
  })
  // [TaskId.UpdateLocalAclRuleData]
  describe(`${ActionType.UpdateLocalAclRuleData}`, () => {
    const editedAclRule = {
      id: 'd256bd45-b62c-48a0-b6c9-a5aa55564ebf',
      name: 'Allow Everything',
      enabled: true,
      rank: 1,
      disposition: {
        action: 'allow',
        applyBlockGatewayList: true,
      },
      tenantId: 'L62803035',
      metadata: {
        description: 'Override the default block behaviour to instead allow everything that reaches this point in the ACL.',
      },
      criteria: {
        riskRange: {
          enabled: true,
          min: 1,
          max: 2,
        },
        destination: {
          negated: false,
          enabled: true,
          ignorePort: false,
          networkServices: [
            {
              id: 'sb56d9d38-1a24-4b81-9d1d-885895b83d26',
              name: 'Aws',
            },
            {
              id: 'sb4f40a82-7ef0-44f2-b6ab-e1e0562d8ee9',
              name: 'Atlassian',
            },
          ],
          targetSet: [
            {
              portSet: [
                {
                  protocol: 'UDP',
                  min: 10,
                  max: 10,
                },
              ],
              addressSet: ['1.1.1.1', '2.1.3.4'],
            },
          ],
        },
        selector: {
          negated: false,
          enabled: true,
          conjunctions: [
            [
              {
                negated: true,
                propertySelector: {
                  property: 'group',
                  values: ['fae39cf3-1b19-4bc7-99b8-1ba18955a8a4', 'ee956a5a-a600-47a9-b222-54c485873cc6'],
                },
              },
              {
                negated: true,
                propertySelector: {
                  property: 'user',
                  values: ['AvYr978zIWesrYnmrCHGtgI='],
                },
              },
            ],
            [
              {
                negated: false,
                propertySelector: {
                  property: 'group',
                  values: ['fae39cf3-1b19-4bc7-99b8-1ba18955a8a4', 'ee956a5a-a600-47a9-b222-54c485873cc6'],
                },
              },
            ],
          ],
        },
        categorySet: {
          negated: false,
          enabled: true,
          categories: [
            {
              id: '10',
            },
            {
              id: '200',
            },
            {
              id: '500',
              subcategories: ['503', '502'],
            },
          ],
        },
      },
      created: 1639487687142,
      updated: 1641389242341,
    } as AclRule

    it(`should update local acl rule General Information`, () => {
      const payload = {
        name: 'New name',
        enabled: false,
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.name = payload.name
      expectedResult.enabled = payload.enabled

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })

    it(`should update local acl rule Disposition`, () => {
      const payload = {
        criteria: {
          destination: {
            ignorePort: true,
          },
        },
        disposition: {
          action: 'block',
          message: 'Error message for device.',
          applyBlockGatewayList: true,
          notify: true,
        },
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.criteria.destination.ignorePort = payload.criteria.destination.ignorePort
      expectedResult.disposition = payload.disposition

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })

    it(`should update local acl rule Destinations`, () => {
      const payload = {
        criteria: {
          destination: {
            networkServices: [{ id: '89c055ca-44d6-4e03-990b-c7101a961d82' }],
            targetSet: [
              {
                addressSet: ['1.1.1.1', '2.1.3.4', '200.0.12.0/25', '200.0.12.0/24'],
                portSet: [
                  {
                    protocol: 'UDP',
                    min: 10,
                    max: 10,
                  },
                  {
                    protocol: 'TCP or UDP',
                    min: '20',
                    max: '20',
                  },
                ],
              },
            ],
          },
        },
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.criteria.destination.targetSet = payload.criteria.destination.targetSet
      expectedResult.criteria.destination.networkServices = payload.criteria.destination.networkServices

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })

    it(`should update local acl rule Category`, () => {
      const payload = {
        criteria: {
          categorySet: {
            categories: [
              {
                id: '400',
              },
              {
                id: '500',
                subcategories: ['503', '502'],
              },
              {
                id: '800',
                subcategories: ['805'],
              },
              {
                id: '900',
                subcategories: ['905', '903'],
              },
            ],
          },
        },
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.criteria.categorySet.categories = payload.criteria.categorySet.categories

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })

    it(`should update local acl rule Conditions/Users or groups`, () => {
      const payload = {
        criteria: {
          selector: {
            enabled: true,
            negated: true,
            conjunctions: [
              [
                {
                  negated: false,
                  propertySelector: {
                    property: 'user',
                    values: ['AvYr978zIWesrYnmrCHGtgI=', 'Ah7kah0ay+ImKt3YFNf5zG4='],
                  },
                },
              ],
              [
                {
                  negated: false,
                  propertySelector: {
                    property: 'group',
                    values: ['a62c7c93-46d0-4760-a7bd-4483a4bd0513'],
                  },
                },
                {
                  negated: true,
                  propertySelector: {
                    property: 'group',
                    values: ['1d0d3904-6fb4-4fb5-9670-dd8da4787e03'],
                  },
                },
              ],
            ],
          },
        },
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.criteria.selector.enabled = payload.criteria.selector.enabled
      expectedResult.criteria.selector.negated = payload.criteria.selector.negated
      expectedResult.criteria.selector.conjunctions = payload.criteria.selector.conjunctions

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })

    it(`should update local acl rule Conditions/Risk`, () => {
      const payload = {
        criteria: {
          riskRange: {
            enabled: true,
            max: 3,
            min: 1,
          },
        },
      } as AclRule

      const action: any = {
        type: ActionType.UpdateLocalAclRuleData,
        payload,
      }

      const previousState = { ...defaultState, ui: { ...defaultState.ui, localAclRuleData: editedAclRule } }

      const expectedResult = { ...editedAclRule }
      expectedResult.criteria.riskRange = payload.criteria.riskRange

      expect(reducer(previousState, action)).toStrictEqual({
        ...previousState,
        ui: { ...previousState.ui, localAclRuleData: expectedResult },
      })
    })
  })
  // [TaskId.ToggleListRankMode]
  describe(`${ActionType.ToggleListRankMode}`, () => {
    it(`should toggle list rank mode`, () => {
      const action: any = {
        type: ActionType.ToggleListRankMode,
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        ...defaultState,
        ui: {
          ...defaultState.ui,
          listRankModeEnabled: true,
        },
      })
    })
  })
  // [ActionType.ClearAclRule]
  describe(`${ActionType.ClearAclRule}`, () => {
    it(`should clear acl rule`, () => {
      const action: any = {
        type: ActionType.ClearAclRule,
      }
      const previousState = { ...defaultState }

      expect(reducer(previousState, action)).toStrictEqual({
        tasks: {
          ...defaultState.tasks,
          [TaskId.FetchAclRule]: { data: {}, error: undefined, loading: false },
        },
        ui: {
          ...defaultState.ui,
          localAclRuleData: DEFAULT_ACL_RULE_DATA,
        },
      })
    })
  })
})
