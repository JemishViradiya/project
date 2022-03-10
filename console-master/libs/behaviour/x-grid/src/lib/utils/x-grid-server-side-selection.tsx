import type React from 'react'
import { useCallback, useEffect } from 'react'

import type { GridCellParams, GridColumnHeaderParams, MuiEvent } from '@material-ui/x-grid'

import { useTableFilter, useTableSelection, useTableSort } from '@ues/behaviours'

export const useXGridSelector = (currentlyLoadedRows, apiRef) => {
  const selectionProps = useTableSelection()
  const { sort, sortDirection } = useTableSort() || {}
  const { activeFilters = undefined } = useTableFilter() || {}

  // Reset selection if filters change
  useEffect(() => {
    selectionProps?.resetSelectedItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters])

  // Scroll to the top on sort change
  useEffect(() => {
    if (apiRef?.current && apiRef?.current.getScrollPosition().top > 0) {
      apiRef.current.scroll({ top: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, sortDirection, activeFilters])

  const onCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // Propagate event. Needed to reach onCellClick handler
  }

  const onCellClick = (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => {
    if (params.field === '__check__' && event.target['checked'] !== undefined) {
      selectionProps.onSelect({ ...apiRef?.current?.getRow(params.id) }, () => false, event.target['checked'])
      event.stopPropagation()
    }
  }

  const onColumnHeaderClick = useCallback(
    (param: GridColumnHeaderParams, event: React.MouseEvent) => {
      if (param.field === '__check__') {
        selectionProps.onSelectAll(event, currentlyLoadedRows)
      }
    },
    [selectionProps, currentlyLoadedRows],
  )

  return {
    onColumnHeaderClick,
    selectionModel: selectionProps?.selected ?? [],
    componentsProps: { checkbox: { onClick: onCheckboxClick } },
    onCellClick,
  }
}
