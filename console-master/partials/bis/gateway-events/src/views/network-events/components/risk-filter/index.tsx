import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RiskLevelTypes } from '@ues-data/bis/model'
import { CheckboxFilter, useCheckboxFilter, useTableFilter } from '@ues/behaviours'

import { TRANSLATION_NAMESPACES } from '../../config'
import { useRiskFilterData } from '../../hooks/use-risk-filter-data'
import { ColumnKey } from '../../types'
import { useStyles } from './styles'

export const RiskFilter: React.FC<{ userIds: string[] }> = ({ userIds }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const riskFilterData = useRiskFilterData({ userIds })

  const filterProps = useTableFilter()
  const props = useCheckboxFilter({ filterProps, key: ColumnKey.Risk })

  const classNames = useStyles()

  const { items, itemsLabels } = useMemo(() => {
    const { levels, labels } = [RiskLevelTypes.CRITICAL, RiskLevelTypes.HIGH, RiskLevelTypes.MEDIUM, RiskLevelTypes.LOW].reduce<
      Record<string, any>
    >(
      (acc, level) => {
        const count = riskFilterData ? riskFilterData[level] ?? 0 : undefined

        if (!count) {
          return acc
        }

        return {
          levels: [...acc.levels, level],
          labels: {
            ...acc.labels,
            [level]: (
              <div className={classNames.labelContainer}>
                <span>{t(`bis/shared:risk.level.${level}`)}</span>
                {typeof count === 'number' ? <span className={classNames.labelCounter}>{count}</span> : null}
              </div>
            ),
          },
        }
      },
      { labels: {}, levels: [] },
    )

    return {
      itemsLabels: labels,
      items: levels,
    }
  }, [classNames, riskFilterData, t])

  return useMemo(
    () => (
      <CheckboxFilter label={t('bis/ues:gatewayAlerts.table.headers.risk')} items={items} itemsLabels={itemsLabels} {...props} />
    ),
    [props, t, items, itemsLabels],
  )
}
