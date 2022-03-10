import type { ConditionsModel, Group, Rule } from './types'
import { VAR_KEY } from './types'

export const exportJsonLogic = (model: ConditionsModel) => {
  const rootGroup = model.groups[0]
  const dataEntityGuids = new Set<string>()
  const rootGroupObj = getGroupJson(rootGroup, model.groups, model.rules, dataEntityGuids)
  return { json: JSON.stringify(rootGroupObj), dataEntityGuids }
}

const getGroupJson = (group: Group, groups: Group[], rules: Rule[], dataEntityGuids: Set<string>) => {
  const result = {}
  // apply rules
  const rules4group = getNonDeletedRules(group.rules, rules)
  if (rules4group.length > 0) {
    const ruleInfo = getRulesJson(rules4group)
    ruleInfo.guids.forEach(g => dataEntityGuids.add(g))
    result[group.condition] = ruleInfo.rulesObj
  } else {
    result[group.condition] = []
  }
  // apply groups
  let nestedGroupObjs = []
  if (group.groups.length > 0) {
    const nonDeletedNestedGroups = getNonDeletedGroups(group.groups, groups)
    nestedGroupObjs = nonDeletedNestedGroups.map(group => {
      return getGroupJson(group, groups, rules, dataEntityGuids)
    })
  }
  //
  if (nestedGroupObjs.length > 0) {
    for (let idx = 0; idx < nestedGroupObjs.length; idx++) {
      result[group.condition].push(nestedGroupObjs[idx])
    }
  }

  return result
}

const getRulesJson = (rules: Rule[]) => {
  const guids = rules.map(r => r.titleGuid)

  const rulesObj = rules.map(r => {
    const result = {}
    const body = {}
    body[VAR_KEY] = r.titleGuid
    result[r.operation] = [body, r.value]
    return result
  })

  return { guids, rulesObj }
}

const getNonDeletedGroups = (groupsIdx, groups: Group[]): Group[] => {
  const nestedGroups: Group[] = groupsIdx.map(idx => groups[idx])
  return nestedGroups.filter(g => !g.isDeleted)
}

const getNonDeletedRules = (groupRulesIdx, rules: Rule[]): Rule[] => {
  const rulesInGroup: Rule[] = groupRulesIdx.map(idx => rules[idx])
  return rulesInGroup.filter(r => !r.isDeleted)
}
