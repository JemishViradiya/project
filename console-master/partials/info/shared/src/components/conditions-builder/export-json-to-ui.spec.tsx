import { getConditionsUI, getGroupDepth } from './export-json-to-ui'
import { getJsonLogicModel } from './json-logic-helper/import'
import type { ConditionsModel } from './json-logic-helper/types'

describe('ui condition builder', () => {
  const onChangeRule = () => {
    console.log('change rule')
  }
  const onChangeGroup = () => {
    console.log('change group')
  }
  it('one group with no rule', () => {
    const jsonLogicTextWithOneGroupAndNoRule = '{"and":[]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndNoRule)

    const conditions = getConditionsUI(model, onChangeRule, onChangeGroup)
    console.log('result = ', JSON.stringify(conditions))
    expect(conditions).toBeDefined()
  })

  it('one group with one rule', () => {
    const jsonLogicTextWithGroupAndOneRule = '{"and":[{">":[{"var":"dataEntityGuid1"},5]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithGroupAndOneRule)

    const conditions = getConditionsUI(model, onChangeRule, onChangeGroup)
    console.log('result = ', JSON.stringify(conditions))
    expect(conditions).toBeDefined()
  })

  it('one group with two rules', () => {
    const jsonLogicTextWithOneGroupAndTwoRules = '{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndTwoRules)

    const conditions = getConditionsUI(model, onChangeRule, onChangeGroup)
    console.log('result = ', JSON.stringify(conditions))
    expect(conditions).toBeDefined()
  })

  it('three groups with four rules', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{"and":[{">":[{"var":"dataEntityGuid3"},6]},{">":[{"var":"dataEntityGuid4"},9]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)

    const conditions = getConditionsUI(model, onChangeRule, onChangeGroup)
    console.log('result = ', JSON.stringify(conditions))
    expect(conditions).toBeDefined()
  })

  it('one root and nested groups with four rules', () => {
    const jsonLogicTextWithTwoGroupAndFourRules =
      '{"and":[{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]},{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithTwoGroupAndFourRules)

    const conditions = getConditionsUI(model, onChangeRule, onChangeGroup)
    console.log('result = ', JSON.stringify(conditions))
    expect(conditions).toBeDefined()
  })

  it('depth of groups is valid number', () => {
    const groups = [
      { condition: 'or', groups: [2, 3], rules: [], isDeleted: false },
      { condition: 'or', groups: [], rules: [1], isDeleted: false },
      { condition: 'or', groups: [1], rules: [0], isDeleted: false },
      { condition: 'or', groups: [], rules: [2], isDeleted: false },
    ]
    const groupsDepth = getGroupDepth(groups, 1)
    expect(groupsDepth).toBe(2)
  })
})
