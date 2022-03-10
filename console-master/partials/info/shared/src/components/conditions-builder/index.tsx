import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { getConditionsUI } from './export-json-to-ui'
import { exportJsonLogic } from './json-logic-helper/export'
import { getJsonLogicModel } from './json-logic-helper/import'
import { ADD_GROUP, ADD_RULE, DELETE_GROUP, DELETE_RULE, UPDATE_GROUP, UPDATE_RULE } from './json-logic-helper/types'
import { conditionBuilderStyles } from './styles'

const initRule = { titleGuid: ' ', operation: '>=', dataTypeName: ' ', value: 1, isDeleted: false }
const initGroup = { condition: 'and', groups: [], rules: [0], isDeleted: false }

export const ConditionsBuilder = ({ conditionEntity, onChangeConditionEntity, editable }) => {
  const { t } = useTranslation('dlp/policy')
  const { wrapper } = conditionBuilderStyles()

  const conditionsModel = getJsonLogicModel(conditionEntity)
  const [conditionsTree, setConditionsTree] = useState(conditionsModel)

  useEffect(() => {
    setConditionsTree(getJsonLogicModel(conditionEntity))
    console.log('updated conditionEntity, set conditionsTree')
  }, [conditionEntity])

  //TODO should be in action-creator functions
  const deleteItem = (arr, index) => {
    const res = arr.slice(0)
    if (res.length) {
      res[index].isDeleted = true
      return res
    }
  }
  const addRule = (instance, newRule, groupIndex) => {
    const rules = [...instance.rules, Object.assign({}, newRule)]
    const groups = instance.groups.slice(0)
    groups[groupIndex].rules = [...groups[groupIndex].rules, rules.length - 1]
    return { groups, rules }
  }
  const addGroup = (instance, newGroup, newRule, groupIndex) => {
    const groups = [...instance.groups, Object.assign({}, newGroup)]
    const rules = [...instance.rules, Object.assign({}, newRule)]
    groups[groupIndex].groups = [...groups[groupIndex].groups, groups.length - 1]
    groups[groups.length - 1].rules = [rules.length - 1]
    return { groups, rules }
  }
  const updateItem = (instance, index, options) => {
    const ruleKeys = ['value', 'titleGuid']
    const optionKey = Object.keys(options).join()
    let rules = instance.rules
    let groups = instance.groups
    const updateInstance = (items, optionKey) => {
      return items?.map((item, i) => {
        if (i === index) {
          return { ...item, [optionKey]: options[optionKey] }
        }
        return item
      })
    }
    if (ruleKeys.includes(optionKey)) {
      rules = updateInstance(rules, optionKey)
    } else {
      groups = updateInstance(groups, optionKey)
    }
    return { groups, rules }
  }

  const onChangeRule = (actionType, ruleId, options = {}) => {
    switch (actionType) {
      case DELETE_RULE:
        setConditionsTree({
          ...conditionsTree,
          rules: deleteItem(conditionsTree.rules, ruleId),
        })
        break
      case UPDATE_RULE:
        setConditionsTree(updateItem(conditionsTree, ruleId, options))
        break
      default:
        break
    }
  }
  const onChangeGroup = (actionType, groupId, options = {}) => {
    switch (actionType) {
      case DELETE_GROUP:
        setConditionsTree({
          ...conditionsTree,
          groups: deleteItem(conditionsTree.groups, groupId),
        })
        break
      case ADD_GROUP:
        setConditionsTree(addGroup(conditionsTree, initGroup, initRule, groupId))
        break
      case ADD_RULE:
        setConditionsTree(addRule(conditionsTree, initRule, groupId))
        break
      case UPDATE_GROUP:
        setConditionsTree(updateItem(conditionsTree, groupId, options))
        break
      default:
        break
    }
  }

  useEffect(() => {
    const copyConditionTree = { ...conditionsTree }
    onChangeConditionEntity(exportJsonLogic(conditionsTree).json)
    console.log('updated conditionsTree, updating conditionEntity in redux ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionsTree /* , onChangeConditionEntity */])

  return (
    <>
      <Typography variant="h3">{t('policy.sections.conditions.builder.title')}</Typography>
      <div className={wrapper}>{getConditionsUI(conditionsTree, onChangeRule, onChangeGroup, editable)}</div>
    </>
  )
}
