import { useCallback, useMemo, useState } from 'react'

import * as common from '../common'
import useUrlSearch from './useUrlSearch'

export default filterOptions => {
  const { urlSearch, addUrlSearchItem, removeUrlSearchItem } = useUrlSearch()

  const [rawState, setState] = useState(() => ({
    filters: { search: '' },
    counter: 0,
  }))

  const isValidFilterType = useCallback(
    type => {
      return !!filterOptions[type]
    },
    [filterOptions],
  )

  const isValidFilterOption = useCallback(
    (type, value) => {
      if (!type || !value) {
        return false
      }
      const options = filterOptions[type]
      return (
        options &&
        options.find(key => {
          return key === value
        })
      )
    },
    [filterOptions],
  )
  const state = useMemo(() => {
    const {
      filters: { search },
      counter,
    } = rawState
    const filters = { search }
    Object.keys(urlSearch).forEach(type => {
      if (isValidFilterType(type)) {
        if (!filters[type]) {
          filters[type] = {}
        }
        let values = urlSearch[type]
        if (!Array.isArray(values)) {
          values = [values]
        }
        values.forEach(value => {
          if (isValidFilterOption(type, value)) {
            filters[type][value] = true
          }
        })
      }
    })
    return {
      filters,
      counter: counter + 1,
    }
  }, [rawState, urlSearch, isValidFilterOption, isValidFilterType])

  const onFilterChange = useCallback(
    (type, key) => {
      let typeFilters = state.filters[type]
      if (!typeFilters) {
        typeFilters = {}
        state.filters[type] = typeFilters
      }
      const { [key]: oldValue } = typeFilters
      if (oldValue !== undefined) {
        return removeUrlSearchItem(type, key)
      } else {
        return addUrlSearchItem(type, key)
      }
    },
    [addUrlSearchItem, removeUrlSearchItem, state.filters],
  )

  const onSearchChange = useCallback(value => {
    setState(state => {
      return {
        filters: {
          ...state.filters,
          search: value,
        },
        counter: state.counter + 1,
      }
    })
  }, [])

  const filterVariables = useMemo(() => {
    const variables = {}
    if (state.filters) {
      Object.keys(state.filters).forEach(key => {
        if (key === 'search') {
          // TODO: SIS-202 indicates we should not search for fewer than 3 characters,
          // but this isn't a great experience, unfortunately.
          if (state.filters.search.length >= 3) {
            variables.username = state.filters.search
          }
        } else {
          variables[key] = Object.keys(state.filters[key])
        }
        if (key === 'ipAddressRisk') {
          variables.ipAddressRisk = variables.ipAddressRisk.map(risk => common.getIpAddressSource(risk))
        }
      })
    }
    return variables
  }, [state.filters])

  return {
    filters: state.filters,
    searchText: state.filters.search,
    onFilterChange,
    onSearchChange,
    filterVariables,
    reset: state.counter,
  }
}
