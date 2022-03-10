/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Permission, usePermissions } from '@ues-data/shared'
import type { InfiniteTableProps, InfiniteTableProviderInputProps } from '@ues/behaviours'
import { useSelected, useSort } from '@ues/behaviours'

type UseProfileAssignmentsInput = {
  data: any
  fetchMore: (variables: any) => Promise<any>
}

type UseProfileAssignmentsReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
}

const idFunction = rowData => rowData.id

export const useProfileAssignments = ({ data, fetchMore }: UseProfileAssignmentsInput): UseProfileAssignmentsReturn => {
  const { t } = useTranslation(['profiles'])
  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission(Permission.ECS_USERS_UPDATE)

  const columns = useMemo(
    () => [
      {
        label: t('policy.assignment.columns.name'),
        dataKey: 'name',
        cellDataGetter: ({ columnData, dataKey, rowData }) => rowData?.name ?? rowData?.displayName,
        sortable: true,
      },
      {
        label: t('policy.assignment.columns.email'),
        dataKey: 'emailAddress',
      },
    ],
    [t],
  )

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.cursor, max: stopIndex - startIndex + 1 },
      }

      await fetchMore(variables)
    },
    [fetchMore, data?.cursor],
  )

  const infinitLoader = {
    rowCount: data?.count?.total ?? 0,
    isRowLoaded: (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false,
    loadMoreRows: onLoadMoreRows,
    threshold: 30,
    minimumBatchSize: 20,
  }

  const sortingProps = useSort(null, 'asc')
  const selectedProps = useSelected('id')

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns],
  )

  const tableProps = {
    noDataPlaceholder: t('policy.list.noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps: canUpdate ? selectedProps : undefined,
    basicProps,
    data: data?.elements ?? [],
  }

  return { tableProps, providerProps }
}
