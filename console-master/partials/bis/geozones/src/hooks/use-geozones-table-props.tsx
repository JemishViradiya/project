import { memoize } from 'lodash'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { CircularGeozoneGeometry, PolygonalGeozoneGeometry } from '@ues-behaviour/google-maps'
import { GeozoneType, GeozoneUnit, getZoneSize, useGoogleMapsApi } from '@ues-behaviour/google-maps'
import type { GeozonesListEntity } from '@ues-data/bis'
import type { InfiniteTableProviderInputProps, SimpleFilter, TableColumn, TableSortDirection } from '@ues/behaviours'
import {
  ColumnPicker,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useClientSort,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { applyFilters } from '../utils/filters'

const SearchFilterComponent = ({ label, columnKey }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: columnKey, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return (
    <QuickSearchFilter
      label={label}
      operators={STRING_OPERATORS.filter(operator => operator !== OPERATOR_VALUES.DOES_NOT_CONTAIN)}
      {...props}
    />
  )
}

const idFunction = rowData => rowData.id

export const useGeozonesTableProps = ({
  data,
  handleRowClick,
}: {
  data: any
  handleRowClick?: any
}): {
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  filterLabelProps: any
  getSelected: any[]
} => {
  const google = useGoogleMapsApi()
  const { t } = useTranslation(['bis/ues'])

  const columns = useMemo((): TableColumn<GeozonesListEntity>[] => {
    const getSize = google
      ? memoize((entity: GeozonesListEntity) => {
          const entityType = entity.geometry.type === 'Polygon' ? GeozoneType.Polygon : GeozoneType.Circle

          const geometry: CircularGeozoneGeometry | PolygonalGeozoneGeometry =
            entityType === GeozoneType.Polygon
              ? { coordinates: entity.geometry.coordinates?.map(([lat, lng]) => ({ lat, lng })) }
              : {
                  radius: entity.geometry.radius,
                  center: {
                    lat: entity.geometry.center?.lat,
                    lng: entity.geometry.center?.lon,
                  },
                }

          return getZoneSize(geometry, entityType, (entity.unit as any) ?? GeozoneUnit.km)
        })
      : () => null

    return [
      {
        label: t('bis/ues:geozones.table.headers.name'),
        dataKey: 'name',
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent label={t('bis/ues:geozones.table.headers.name')} columnKey="name" />,
      },
      {
        label: t('bis/ues:geozones.table.headers.size'),
        dataKey: 'size',
        renderCell: data => {
          const size = getSize(data)
          return size ? t('bis/ues:geozones.table.cells.size', size) : null
        },
        show: true,
        persistent: true,
      },
      {
        label: t('bis/ues:geozones.table.headers.location'),
        dataKey: 'location',
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent label={t('bis/ues:geozones.table.headers.location')} columnKey="location" />,
      },
    ]
  }, [t, google])

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns: columns,
    title: t('bis/ues:geozones.table.columnPicker'),
  })

  const selectedProps = useSelected('id')

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} tableCell={false} />,
      onRowClick: handleRowClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const filteredData = useMemo(() => applyFilters(filterProps?.activeFilters, data), [filterProps.activeFilters, data])

  const sortingProps = useSort('name', 'asc')
  const { sort, sortDirection } = sortingProps

  const sortedData = useClientSort({
    data: filteredData,
    sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
  })

  const providerProps = {
    sortingProps,
    selectedProps,
    basicProps,
    data: sortedData ?? [],
    filterProps,
  }
  const getSelected = providerProps.data?.filter(d => selectedProps?.selected.includes(idFunction(d))) || []

  return { providerProps, filterLabelProps, getSelected }
}
