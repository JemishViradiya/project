import React from 'react'
import { useTranslation } from 'react-i18next'

import { Adjunction } from './json-logic-helper/types'
import { conditionBuilderStyles } from './styles'

const CONDITIONS = [Adjunction.AND, Adjunction.OR]

type conditionComponentItem = {
  conditionsData?: string[]
  selectedCondition: string
  groupId: number
  changeCondition: any
  editable: boolean
}
const ConditionEntity = ({
  conditionsData = CONDITIONS,
  selectedCondition,
  groupId,
  changeCondition,
  editable,
}: conditionComponentItem) => {
  const { t } = useTranslation('dlp/policy')
  const { conditionWrapper } = conditionBuilderStyles()
  const handleCondition = e => {
    changeCondition({ condition: e.target.value })
  }

  return (
    <div className={conditionWrapper}>
      {conditionsData?.map((condition, index) => {
        const isChecked = condition === selectedCondition
        return (
          <span key={`${groupId}-${index}`}>
            <input
              type="radio"
              id={`option-${condition}-${groupId}-${index}`}
              value={condition}
              name={`condition-${groupId}-${index}`}
              onChange={handleCondition}
              checked={isChecked}
              disabled={!editable}
            />
            <label htmlFor={`option-${condition}-${groupId}-${index}`}>
              {t(`policy.sections.conditions.builder.condition.${condition}`)}
            </label>
          </span>
        )
      })}
    </div>
  )
}

export default ConditionEntity
