import type { ConditionsModel } from './index'
import { exportJsonLogic, getJsonLogicModel } from './index'

describe('json logic export', () => {
  it('one group with no rule', () => {
    const jsonLogicTextWithOneGroupAndNoRule = '{"and":[]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndNoRule)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithOneGroupAndNoRule)
  })

  it('one group with one rule', () => {
    const jsonLogicTextWithGroupAndOneRule = '{"and":[{">":[{"var":"dataEntityGuid1"},5]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithGroupAndOneRule)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithGroupAndOneRule)
  })

  it('one group with two rules', () => {
    const jsonLogicTextWithOneGroupAndTwoRules = '{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithOneGroupAndTwoRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithOneGroupAndTwoRules)
  })

  it('three groups with four rules', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{"and":[{">":[{"var":"dataEntityGuid3"},6]},{">":[{"var":"dataEntityGuid4"},9]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithThreeGroupsAndFourRules)
  })

  it('one root and nested groups with four rules', () => {
    const jsonLogicTextWithTwoGroupAndFourRules =
      '{"and":[{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]},{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithTwoGroupAndFourRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithTwoGroupAndFourRules)
  })

  it('skip rules marked as deleted', () => {
    const jsonLogicTextWithTwoGroupAndFourRules =
      '{"and":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]}]}'
    const expectedOutput = '{"and":[{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]},{"and":[]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithTwoGroupAndFourRules)

    model.rules[0].isDeleted = true
    model.rules[1].isDeleted = true

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(expectedOutput)
  })

  it('skip groups marked as deleted', () => {
    const jsonLogicTextWithTwoGroupAndFourRules =
      '{"and":[{"and":[{">":[{"var":"dataEntityGuid1"},5]},{">":[{"var":"dataEntityGuid2"},8]}]},{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]}]}'
    const expectedOutput = '{"and":[{">":[{"var":"dataEntityGuid3"},5]},{">":[{"var":"dataEntityGuid4"},8]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithTwoGroupAndFourRules)

    model.groups[1].isDeleted = true

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(expectedOutput)
  })

  it('three groups with four rules', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid1"},5]}]},{"and":[{">":[{"var":"dataEntityGuid3"},6]},{"or":[{"==":[{"var":"dataEntityGuid4"},5]}]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithThreeGroupsAndFourRules)
  })

  it('with nested groups A', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid1"},5]}]},{"and":[{">":[{"var":"dataEntityGuid3"},6]},{"or":[{"==":[{"var":"dataEntityGuid4"},5]}]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithThreeGroupsAndFourRules)
  })

  it('with nested groups B', () => {
    const jsonLogicTextWithThreeGroupsAndFourRules =
      '{"or":[{"and":[{">":[{"var":"dataEntityGuid3"},6]},{"or":[{"==":[{"var":"dataEntityGuid4"},5]}]}]}]}'
    const model: ConditionsModel = getJsonLogicModel(jsonLogicTextWithThreeGroupsAndFourRules)

    const { json } = exportJsonLogic(model)
    expect(json).toEqual(jsonLogicTextWithThreeGroupsAndFourRules)
  })
})
