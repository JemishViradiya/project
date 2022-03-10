import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@material-ui/core'

import { BasicAdd, BasicAddRound, BasicDelete } from '@ues/assets'

import ConditionEntity from './condition'
import { ADD_GROUP, ADD_RULE, DELETE_GROUP, UPDATE_GROUP } from './json-logic-helper/types'
import { conditionBuilderStyles } from './styles'

type GroupItem = {
  id: number
  onChange?: any
  children?: React.ReactNode
  condition?: string
  disableAddGroup: boolean
  editable: boolean
}
const ConditionGroup = ({ id, children, onChange, condition, disableAddGroup, editable }: GroupItem) => {
  const { header, button, group, childGroup } = conditionBuilderStyles()
  const { t } = useTranslation('dlp/policy')

  const onAddRule = () => {
    onChange(ADD_RULE, id)
  }

  const onAddGroup = () => {
    onChange(ADD_GROUP, id)
  }
  const onDeleteGroup = () => {
    onChange(DELETE_GROUP, id)
  }

  const onUpdateCondition = options => {
    onChange(UPDATE_GROUP, id, options)
  }

  return (
    <div className={`group-or-rule ${group} ${id !== 0 ? childGroup : ''}`}>
      <div className={header}>
        <ConditionEntity selectedCondition={condition} groupId={id} changeCondition={onUpdateCondition} editable={editable} />
        <div>
          <Button
            className={button}
            variant="outlined"
            color="primary"
            startIcon={<BasicAdd />}
            onClick={onAddRule}
            disabled={!editable}
          >
            {t('policy.sections.conditions.builder.buttons.addRule')}
          </Button>
          <Button
            className={button}
            variant="outlined"
            color="primary"
            startIcon={<BasicAddRound />}
            onClick={onAddGroup}
            disabled={disableAddGroup}
          >
            {t('policy.sections.conditions.builder.buttons.addGroup')}
          </Button>
          {id !== 0 ? (
            <Button className={button} variant="outlined" color="primary" startIcon={<BasicDelete />} onClick={onDeleteGroup}>
              {t('policy.sections.conditions.builder.buttons.deleteGroup')}
            </Button>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  )
}

export default ConditionGroup
