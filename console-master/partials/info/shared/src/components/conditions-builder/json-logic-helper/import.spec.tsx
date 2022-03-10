import type { ConditionsModel } from './index'
import { getJsonLogicModel } from './index'

describe('json logic import', () => {
  it('one group and no rule', () => {
    const jsonLogicTextWithOneGroupAndNoRule = '{"and":[]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndNoRule)
    expect(model.groups.length).toEqual(1)
    expect(model.rules.length).toEqual(0)
  })

  it('one group and one rule', () => {
    const jsonLogicTextWithGroupAndOneRule = '{"and":[{">":[{"var":"dataEntityGuid1"},5]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithGroupAndOneRule)
    expect(model.groups.length).toEqual(1)
    expect(model.rules.length).toEqual(1)
  })

  it('one group and two rules', () => {
    const jsonLogicTextWithOneGroupAndTwoRules = '{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndTwoRules)
    expect(model.groups.length).toEqual(1)
    expect(model.rules.length).toEqual(2)
  })

  it('three groups and four rules', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{"and":[{">":[{"var":"dataEntityGuid3"},6]},{">":[{"var":"dataEntityGuid4"},9]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)
    expect(model.groups.length).toEqual(3)
    expect(model.rules.length).toEqual(4)
    expect(model.rules.map(r => r.titleGuid)).toEqual(['dataEntityGuid1', 'dataEntityGuid2', 'dataEntityGuid3', 'dataEntityGuid4'])
  })

  it('one root and nested groups and four rules', () => {
    const jsonLogicTextWithTwoGroupAndFourRules =
      '{"and":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithTwoGroupAndFourRules)
    expect(model.groups.length).toEqual(2)
    expect(model.groups[0].condition).toEqual('and')
    expect(model.groups[1].condition).toEqual('and')
    expect(model.rules.length).toEqual(4)
    expect(model.rules[0].operation).toEqual('>')
    expect(model.rules[0].value).toEqual(5)
    expect(model.rules.map(r => r.titleGuid)).toEqual(['dataEntityGuid1', 'dataEntityGuid2', 'dataEntityGuid3', 'dataEntityGuid4'])
  })

  it('badly formatted', () => {
    const badlyFormmatedString = '{"and":[{",8]}]}'
    const model: ConditionsModel = getJsonLogicModel(badlyFormmatedString)
    expect(model.groups.length).toEqual(0)
    expect(model.rules.length).toEqual(0)
  })
})
