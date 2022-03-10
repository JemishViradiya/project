import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Permission, usePermissions } from '@ues-data/shared'
import {
  BrandAndroid,
  BrandApple,
  BrandCylance,
  BrandGuard,
  BrandLinux,
  BrandOptics,
  BrandPersona,
  BrandProtect,
  BrandWindows,
} from '@ues/assets'
import type { InfiniteTableProps, InfiniteTableProviderInputProps, TableColumn } from '@ues/behaviours'
import { ColumnPicker, useColumnPicker, useSelected, useSort } from '@ues/behaviours'
import type { UseSort } from '@ues/behaviours/src/tables/useSort/useSort'

type UseExclusionsListInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  fetchMore: (variable: any) => unknown | Promise<any>
  columns: TableColumn[]
  sortingProps: UseSort<any>
}

type UseExclusionsListReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  getSelected: () => any[]
  idFunction: (rowData) => any
}

const idFunction = rowData => rowData.guid

export const BrandIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'android':
      return <BrandAndroid fontSize="small" />
    case 'ios':
      return <BrandApple fontSize="small" />
    case 'cylance':
      return <BrandCylance fontSize="small" />
    case 'guard':
      return <BrandGuard fontSize="small" />
    case 'linux':
      return <BrandLinux fontSize="small" />
    case 'optics':
      return <BrandOptics fontSize="small" />
    case 'persona':
      return <BrandPersona fontSize="small" />
    case 'protect':
      return <BrandProtect fontSize="small" />
    case 'windows':
      return <BrandWindows fontSize="small" />
    default:
      return
  }
}

export const MessageFromItemList = ({ selectedItems }): JSX.Element => {
  return (
    <>
      {selectedItems.map(item => (
        <div>
          <b>{item?.value || item?.name}</b>
        </div>
      ))}
    </>
  )
}

export const useExclusionsList = ({ data, fetchMore, columns, sortingProps }: UseExclusionsListInput): UseExclusionsListReturn => {
  const { t } = useTranslation(['mtd/common'])
  const { t: tcommon } = useTranslation(['platform/common'])
  const { hasAnyPermission } = usePermissions()

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: t('exclusion.list.columnPicker') })
  const selectedProps = useSelected('guid')

  const fetchMoreItems = useCallback(
    async ({ offset, max }): Promise<any> => {
      if (sortingProps.sort == null) {
        await fetchMore({ offset: offset, max: max })
      } else {
        await fetchMore({ offset: offset, max: max, sortBy: `${sortingProps.sort} ${sortingProps.sortDirection}` })
      }
    },
    [fetchMore, sortingProps.sort, sortingProps.sortDirection],
  )

  const onLoadMoreRows = useCallback(
    async indexProps => {
      const variables = {
        offset: indexProps.startIndex,
        max: indexProps.stopIndex - indexProps.startIndex + 1,
      }

      await fetchMoreItems(variables)
    },
    [fetchMoreItems],
  )

  const infinitLoader = useMemo(
    () => ({
      rowCount: data?.totals?.elements ?? 0,
      isRowLoaded: (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false,
      loadMoreRows: onLoadMoreRows,
      threshold: 10,
      minimumBatchSize: 25,
    }),
    [data, onLoadMoreRows],
  )

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      idFunction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const tableProps = {
    noDataPlaceholder: hasAnyPermission(
      Permission.VENUE_SETTINGSGLOBALLIST_READ,
      Permission.VENUE_SETTINGSGLOBALLIST_CREATE,
      Permission.VENUE_SETTINGSGLOBALLIST_UPDATE,
    )
      ? t('exclusion.list.noData')
      : tcommon('noAccessMessage'),
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

  return { tableProps, providerProps, getSelected, idFunction }
}
