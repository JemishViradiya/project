// dependencies
import { map } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// constants
import { FILTER_VALUES, OPERATOR_VALUES } from '../filters'

const getLabelValueTranslation = ({ t, operator, label, value }) =>
  operator ? t('filterLabelValueOperator', { operator, label, value }) : t('filterLabelValue', { label, value })

const getFilterLabel = (filter, filterKey, columns, t, i18n, localizationLabels) => {
  const column = columns.find(col => col.id === filterKey || col.dataKey === filterKey)
  const { label, filterType } = column
  const getFilterValue = FILTER_VALUES[filterType]
  const filterValue = getFilterValue(filter, t, i18n)

  if (filter.operator === OPERATOR_VALUES.IS_BETWEEN) {
    const { formatter } = filter
    const [v1, v2] = filterValue
    return getLabelValueTranslation({
      t,
      label,
      value: t(filter.operator, { v1: formatter ? formatter(v1) : v1, v2: formatter ? formatter(v2) : v2 }),
    })
  } else if (filter.operator === OPERATOR_VALUES.IS_IN) {
    const localizedFilterValue = localizationLabels ? filterValue.map(v => localizationLabels[v] || filterValue) : filterValue
    return getLabelValueTranslation({
      t,
      label,
      value: t(filter.operator, { value: localizedFilterValue.join(',') }),
    })
  }

  const localizedFilterValue = localizationLabels ? localizationLabels[filterValue] || filterValue : filterValue
  return getLabelValueTranslation({
    t,
    label,
    value: localizedFilterValue,
    operator: t(filter.operator),
  })
}

const useFilterLabels = (activeFilters, columns, localizationLabels = undefined) => {
  const { t, i18n } = useTranslation('tables')
  const activeFilterLabels = useMemo(
    () =>
      map(activeFilters, (filter, filterKey) => ({
        label: getFilterLabel(filter, filterKey, columns, t, i18n, localizationLabels),
        filterKey,
      })),
    [activeFilters, columns, i18n, localizationLabels, t],
  )

  const hasActiveFilters = activeFilterLabels.length > 0

  // hook interface
  return {
    activeFilterLabels,
    hasActiveFilters,
  }
}

export default useFilterLabels
