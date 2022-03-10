interface UseFilterLabelsInterface<T> {
  activeFilterLabels: { label: string; filterKey: T }[]
  hasActiveFilters: boolean
}

export { UseFilterLabelsInterface }
