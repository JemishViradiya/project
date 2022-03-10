import React from 'react'

import ConditionGroup from './condition-group'
import ConditionRule from './condition-rule'
import type { ConditionsModel, Group, Rule } from './json-logic-helper/types'

const maxGroupNestedIdx = 2 //disable adding new group if current groups depth is equaled this value

export const getConditionsUI = (model: ConditionsModel, onChangeRule, onChangeGroup, editable) => {
  const rootGroup = model.groups[0]
  if (!model || model.groups.length === 0) {
    return <div> </div>
  }
  return getConditionBlockEntries(rootGroup, model.groups, model.rules, onChangeRule, onChangeGroup, editable)
}

export const getConditionBlockEntries = (group: Group, groups: Group[], rules: Rule[], onChangeRule, onChangeGroup, editable) => {
  // apply groups
  let nestedGroupObjs = []
  if (group.groups.length > 0) {
    const nonDeletedNestedGroups = getNonDeletedGroups(group.groups, groups)
    nestedGroupObjs = nonDeletedNestedGroups.map(group => {
      return getConditionBlockEntries(group, groups, rules, onChangeRule, onChangeGroup, editable)
    })
  }
  // apply rules
  const rules4group = getNonDeletedRules(group.rules, rules)
  const rulesPerGroup = rules4group?.map(item => {
    const idx = rules.indexOf(item)
    return (
      <ConditionRule
        id={idx}
        key={idx}
        minOccurrenceValue={item.value}
        onChange={onChangeRule}
        titleGuid={item.titleGuid}
        editable={editable}
      />
    )
  })

  const groupIdx = groups.indexOf(group)
  const groupDepth = getGroupDepth(groups, groupIdx)

  return (
    <ConditionGroup
      id={groupIdx}
      key={groupIdx}
      onChange={onChangeGroup}
      condition={group.condition}
      disableAddGroup={editable && groupDepth < maxGroupNestedIdx ? false : true}
      editable={editable}
    >
      {rulesPerGroup?.map(item => item)} {nestedGroupObjs}
    </ConditionGroup>
  )
}

const getNonDeletedGroups = (groupsIdx, groups: Group[]): Group[] => {
  const nestedGroups: Group[] = groupsIdx?.map(idx => groups[idx])
  return nestedGroups?.filter(g => !g?.isDeleted)
}

const getNonDeletedRules = (groupRulesIdx, rules: Rule[]): Rule[] => {
  const rulesInGroup: Rule[] = groupRulesIdx?.map(idx => rules[idx])
  return rulesInGroup?.filter(r => !r?.isDeleted)
}

export const getGroupDepth = (groups, idx, counter?) => {
  let depth = counter || 0
  const foundGroupIndex = groups.findIndex(el => el.groups.includes(idx))
  if (foundGroupIndex > -1) {
    const newCounter = ++depth
    return getGroupDepth(groups, foundGroupIndex, newCounter)
  }
  return depth
}
