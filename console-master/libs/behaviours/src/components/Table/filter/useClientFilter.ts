import { isEmpty } from 'lodash-es'
import { useMemo } from 'react'

import { meetsFilter } from '../../../tables/useClientTable/meetsFilter'
import type { EnhancedFieldConfig } from '../../EnhancedSearch'
import type { TableColumn } from '../types'

export const useClientFilter = <TDataEntry>(props: {
  data: TDataEntry[]
  activeFilters: Record<string, any>
  filterProps: (TableColumn | EnhancedFieldConfig)[]
}): TDataEntry[] => {
  const { data, activeFilters, filterProps } = props

  return useMemo(() => {
    if (!activeFilters || !data || Object.keys(activeFilters).length < 1) {
      return data
    }

    return data.filter(row => {
      let show = true

      Object.keys(activeFilters).forEach(key => {
        if (!isEmpty(activeFilters[key])) {
          const filter = filterProps.find(c => c.dataKey === key)
          const filterType = (filter as TableColumn).filterType || (filter as EnhancedFieldConfig).type

          if (!meetsFilter(row[key], activeFilters[key], filterType)) {
            show = false
          }
        }
      })

      return show
    })
  }, [activeFilters, data, filterProps])
}
