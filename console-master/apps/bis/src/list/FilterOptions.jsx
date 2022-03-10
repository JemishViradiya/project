import PropTypes from 'prop-types'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material-ui/core/Checkbox'

import { useStatefulApolloQuery } from '@ues-data/shared'

import { common } from '../shared'
import styles from './Filter.module.less'

const mapFilterResultToOptionKey = (resultKey, field) =>
  field === 'ipAddressRisk' ? common.getIpAddressRisk(resultKey) : resultKey

export const FilterOption = memo(({ label, checked, field, i: key, count, setRef, t }) => {
  const ref = useMemo(() => input => setRef({ field, key }, input), [field, key, setRef])
  const numItems = count || 0

  return (
    <label className={styles.row}>
      <Checkbox size="small" className={styles.checkbox} defaultChecked={checked} inputRef={ref} />
      <span className={styles.label} aria-label={t(label)}>
        {t(label)}
      </span>
      <span aria-label={t('common.list.filterAriaLabel', { count: numItems })} className={styles.count}>
        {numItems}
      </span>
    </label>
  )
})

const FilterOptions = memo(({ dataAccessor, field, options, query, variables, setRef }) => {
  const { t } = useTranslation()

  const computedVariables = useMemo(
    () => ({
      ...variables,
      type: field,
    }),
    [variables, field],
  )

  const { loading, error, data: _data } = useStatefulApolloQuery(query, {
    variables: computedVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })
  const data = loading || error ? undefined : _data
  return useMemo(() => {
    return options.map(({ key, label, checked }, i) => {
      const dataPoint = data && dataAccessor(data).find(d => mapFilterResultToOptionKey(d.key, field) === key)
      const count = dataPoint ? dataPoint.count : null
      return <FilterOption key={key} i={key} field={field} count={count} label={label} checked={checked} setRef={setRef} t={t} />
    })
  }, [options, data, dataAccessor, field, setRef, t])
})

FilterOptions.propTypes = {
  setRef: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  variables: PropTypes.object,
  dataAccessor: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    }),
  ).isRequired,
}

FilterOptions.defaultProps = {
  variables: {},
}

export default FilterOptions
