import { useCallback, useMemo } from 'react'

import type { InfiniteTableProps, InfiniteTableProviderInputProps, TableColumn } from '@ues/behaviours'
import { useSelected, useSort } from '@ues/behaviours'

type SortableInfiniteTableWithGuidIdentifierInput = {
  data: any
  fetchMore: (variables: any) => Promise<any>
  columns: TableColumn[]
  noDataLabel: string
  threshold: number
  minimumBatchSize: number
}

type SortableInfiniteTableWithGuidIdentifierReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  getSelected: () => any[]
}

const idFunction = rowData => rowData.guid

export const useSortableInfiniteTableWithGuidIdentifier = ({
  data,
  fetchMore,
  columns,
  noDataLabel,
  threshold,
  minimumBatchSize,
}: SortableInfiniteTableWithGuidIdentifierInput): SortableInfiniteTableWithGuidIdentifierReturn => {
  const onLoadMoreRows = useCallback(
    async indexProps => {
      const variables = {
        offset: indexProps.startIndex,
        max: indexProps.stopIndex - indexProps.startIndex + 1,
      }

      await fetchMore(variables)
    },
    [fetchMore],
  )

  const infinitLoader = {
    rowCount: data?.totals?.elements ?? 0,
    isRowLoaded: (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false,
    loadMoreRows: onLoadMoreRows,
    threshold: threshold,
    minimumBatchSize: minimumBatchSize,
  }

  const sortingProps = useSort(null, 'asc')
  const selectedProps = useSelected('guid')

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns],
  )

  const tableProps = {
    noDataPlaceholder: noDataLabel,
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps,
    basicProps,
    data: data?.elements ?? [],
  }

  const getSelected = useCallback(() => {
    return data?.elements ? data?.elements?.filter(d => selectedProps?.selected?.includes(idFunction(d))) : []
  }, [data?.elements, selectedProps?.selected])

  return { tableProps, providerProps, getSelected }
}
