import i18n from 'i18next'
import React from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { loadNamespaces } from 'test-utils'

import { renderHook } from '@testing-library/react-hooks'

import { FILTER_TYPES, OPERATOR_VALUES } from '../filters'
import useFilterLabels from './useFilterLabels'

describe('useFilterLabels', () => {
  const initialFilters = {
    name: {
      key: 'name',
      value: 'last',
      label: 'Name',
    },
    age: {
      key: 'age',
      values: [20, 40],
      label: 'Age',
    },
    source: {
      key: 'source',
      values: ['LOCAL', 'AD'],
      label: 'Source',
    },
  }
  const activeFilters = {
    [initialFilters.name.key]: {
      operator: OPERATOR_VALUES.ENDS_WITH,
      value: initialFilters.name.value,
    },
    [initialFilters.age.key]: {
      operator: OPERATOR_VALUES.IS_BETWEEN,
      value: initialFilters.age.values,
    },
    [initialFilters.source.key]: {
      value: initialFilters.source.values[0],
    },
  }
  const columns = [
    {
      id: initialFilters.name.key,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      label: initialFilters.name.label,
    },
    {
      id: initialFilters.age.key,
      filterType: FILTER_TYPES.NUMERIC_RANGE,
      label: initialFilters.age.label,
    },
    {
      id: initialFilters.source.key,
      filterType: FILTER_TYPES.RADIO,
      label: initialFilters.source.label,
    },
  ]

  let I18Provider
  beforeAll(async () => {
    await loadNamespaces('tables')
    I18Provider = ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  })

  it('hasActiveFilters should be true when there are active filters.', async () => {
    const {
      result: {
        current: { hasActiveFilters },
      },
    } = renderHook(() => useFilterLabels(activeFilters, columns), { wrapper: I18Provider })

    expect(hasActiveFilters).toBe(true)
  })

  it('hasActiveFilters should be false when there are no active filters.', () => {
    const {
      result: {
        current: { hasActiveFilters },
      },
    } = renderHook(() => useFilterLabels({}, columns), { wrapper: I18Provider })

    expect(hasActiveFilters).toBe(false)
  })

  it('filterKey is existed on active filter label.', () => {
    const {
      result: {
        current: { activeFilterLabels },
      },
    } = renderHook(() => useFilterLabels(activeFilters, columns), { wrapper: I18Provider })

    expect(activeFilterLabels[0].filterKey).toEqual(initialFilters.name.key)
  })

  it('filter label format.', () => {
    const {
      result: {
        current: { activeFilterLabels },
      },
    } = renderHook(() => useFilterLabels(activeFilters, columns), { wrapper: I18Provider })
    const {
      result: {
        current: { t },
      },
    } = renderHook(() => useTranslation('tables'), { wrapper: I18Provider })

    const expectedLabel = `${initialFilters.name.label} ${t(OPERATOR_VALUES.ENDS_WITH)} ${initialFilters.name.value}`

    expect(activeFilterLabels[0].label).toEqual(expectedLabel)
  })

  it('filter localized radio.', () => {
    const {
      result: {
        current: { activeFilterLabels },
      },
    } = renderHook(() => useFilterLabels(activeFilters, columns, { LOCAL: 'Local' }), { wrapper: I18Provider })

    const expectedLabel = `${initialFilters.source.label} Local`

    expect(activeFilterLabels[2].label).toEqual(expectedLabel)
  })
})
