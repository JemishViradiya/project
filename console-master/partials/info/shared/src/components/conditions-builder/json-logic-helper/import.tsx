import type { ConditionsModel, Group, Rule } from './types'
import { Adjunction, checkIfAdjunctionAllowed, Operation, VAR_KEY } from './types'

export const getEmptyConditions = (): ConditionsModel => {
  return {
    groups: [],
    rules: [],
  }
}
//
export const getEmptyGroup = (): Group => {
  return {
    condition: Adjunction.AND, // and, or etc.
    groups: [], // refs
    rules: [], // refs
    isDeleted: false,
  }
}
//
export const getEmptyRule = (): Rule => {
  return {
    titleGuid: '', // data types guid
    operation: Operation.GREAT_OR_EQUAL, // great, less, equal, greatOrEqual, lessOrEqual
    dataTypeName: '',
    value: 0,
    isDeleted: false,
  }
}

export const getJsonLogicModel = (jsonTree: string): ConditionsModel => {
  return processJsonLogicData(jsonTree)
}

const processJsonLogicData = (
  jsonTree: string,
  conditions: ConditionsModel = undefined,
  topGroupRef = undefined,
  parseRequired = true,
): ConditionsModel => {
  if (!conditions) {
    conditions = getEmptyConditions()
  }
  let jsonObj = jsonTree
  if (parseRequired) {
    try {
      jsonObj = JSON.parse(jsonTree) // JSON validity test
    } catch (e) {
      console.log('jsonLogic decoding failed for input= ', jsonTree)
      return conditions
    }
  }
  // find root group adj
  const rootOperation = Object.keys(jsonObj)[0]
  if (!topGroupRef) {
    topGroupRef = getEmptyGroup()
    topGroupRef.condition = rootOperation
    conditions.groups.push(topGroupRef)
  }
  // only array of items are allowed in tail
  const tailArr = jsonObj[rootOperation]
  if (!tailArr || tailArr.length === 0) {
    return conditions
  }
  //
  tailArr.forEach(item => {
    const operation = Object.keys(item)[0].toLowerCase()
    // ---------------------------------
    if (checkIfAdjunctionAllowed(operation)) {
      // group
      const group = getEmptyGroup()
      group.condition = operation // Adjunction[operation]
      processJsonLogicData(item, conditions, group, false)
      // save
      conditions.groups.push(group)
      topGroupRef.groups.push(conditions.groups.indexOf(group))
      // return
    } else {
      // rule
      const rule = getEmptyRule()
      // ---------------------------------
      const ruleBody = item[operation]
      let ruleGuid
      let ruleValue
      ruleBody.forEach(i => {
        if (i[VAR_KEY] !== undefined) {
          ruleGuid = i.var
        } else {
          ruleValue = i
        }
      })
      if (!ruleGuid || !ruleValue) {
        console.log('failed to parse the rule= ', ruleBody)
      } else {
        rule.operation = operation
        rule.titleGuid = ruleGuid
        rule.value = ruleValue
        // save
        conditions.rules.push(rule)
        topGroupRef.rules.push(conditions.rules.indexOf(rule))
      }
    }
  })
  return conditions
}
