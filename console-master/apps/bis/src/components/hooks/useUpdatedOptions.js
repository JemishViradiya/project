import { useMemo } from 'react'

const useUpdatedOptions = (filters, onFilterChange, optionsBase) =>
  useMemo(() => {
    let showButton = false
    const { field } = optionsBase
    const options = {
      ...optionsBase,
      levels: optionsBase.levels.map(levelBase => {
        const fieldFilters = filters[field]
        const level = {
          ...levelBase,
          onToggle: () => {
            onFilterChange(field, levelBase.key)
          },
          checked: fieldFilters ? !!fieldFilters[levelBase.key] : false,
        }
        if (level.checked) {
          showButton = true
        }
        return level
      }),
    }
    return [options, showButton]
  }, [filters, onFilterChange, optionsBase])

export default useUpdatedOptions
