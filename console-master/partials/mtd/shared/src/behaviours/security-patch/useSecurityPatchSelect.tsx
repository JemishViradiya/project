/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TableSortDirection, useSelected, useSort } from '@ues/behaviours'
import type { InfiniteTableProps, InfiniteTableProviderInputProps } from '@ues/behaviours/src/components'

export const DEFAULT_SORT = { sortBy: 'vendor', sortDir: TableSortDirection.Asc }

type UseSecurityPatchInput = {
  data: any
  unfilteredData: any
  fetchMore: (variables: any) => Promise<any>
}

type UseSecurityPatchReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  getSelected: () => any[]
}

const idFunction = rowData => rowData.vendor + rowData.brand

export const useSecurityPatchSelect = ({ data, unfilteredData, fetchMore }: UseSecurityPatchInput): UseSecurityPatchReturn => {
  const { t } = useTranslation(['mtd/common'])

  const columns = useMemo(
    () => [
      {
        label: t('policy.androidHwAttestationSecurityPatchVendor'),
        dataKey: 'vendor',
        sortable: true,
      },
      {
        label: t('policy.androidHwAttestationSecurityPatchBrand'),
        dataKey: 'brand',
        sortable: true,
      },
    ],
    [t],
  )

  const infinitLoader = {
    rowCount: data?.count?.total ?? 0,
    isRowLoaded: (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false,
    loadMoreRows: fetchMore,
    threshold: 30,
    minimumBatchSize: 20,
  }

  const sortingProps = useSort('vendor', 'asc')
  const selectedProps = useSelected(undefined, idFunction)

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
    }),
    [columns],
  )

  const tableProps = {
    noDataPlaceholder: t('mobileAlert.list.noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps,
    basicProps,
    data: data?.elements ?? [],
  }

  const getSelected = useCallback(() => {
    return unfilteredData?.elements.filter(d => selectedProps.selected.includes(idFunction(d))) ?? []
  }, [selectedProps.selected, unfilteredData?.elements])

  return { tableProps, providerProps, getSelected }
}
