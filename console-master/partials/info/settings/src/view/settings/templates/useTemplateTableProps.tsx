/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Moment } from 'moment'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DATA_TYPES, INFO_TYPES, REGION, TEMPLATE_FIELDS } from '@ues-data/dlp'
import type { CustomFilter, InfiniteTableProps, InfiniteTableProviderInputProps, SimpleFilter } from '@ues/behaviours'
import {
  BooleanFilter,
  ColumnPicker,
  DatePickerFilter,
  DateRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  useBooleanFilter,
  useColumnPicker,
  useDatePickerFilter,
  useDateRangeFilter,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useRadioFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'

const DEFAULT_FIELD = 'name'
const NameFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: TEMPLATE_FIELDS.NAME, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
}

const DescriptionFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: TEMPLATE_FIELDS.DESCRIPTION, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
}

const SourceFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: TEMPLATE_FIELDS.TYPE })
  return <RadioFilter label={label} items={Object.values(DATA_TYPES)} {...props} />
}

const StatusFilterComponent = ({ label, option }) => {
  const filterProps = useTableFilter<SimpleFilter<boolean>>()
  const props = useBooleanFilter({ filterProps, key: TEMPLATE_FIELDS.STATUS })
  return <BooleanFilter label={label} optionLabel={option} {...props} />
}

const RegionFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: TEMPLATE_FIELDS.REGIONS })
  return <RadioFilter label={label} items={Object.values(REGION)} {...props} />
}

const InfoTypeFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: TEMPLATE_FIELDS.INFO_TYPES })
  return <RadioFilter label={label} items={Object.values(INFO_TYPES)} {...props} />
}

const DataEntitiesFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: TEMPLATE_FIELDS.DATA_ENTITIES, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
}

const DateModifiedFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: TEMPLATE_FIELDS.UPDATED, defaultOperator: OPERATOR_VALUES.BEFORE })
  return <DatePickerFilter label={label} {...props} />
}

const DateCreatedFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<CustomFilter<DateRangeFilter>>()
  const props = useDateRangeFilter({ filterProps, key: TEMPLATE_FIELDS.CREATED })
  return <DateRangeFilter label={label} {...props} />
}

type UseTemplateInput = {
  data: any
  fetchMore?: (variables: any) => Promise<any>
  handleRowClick?: any
  setSortParams: (sortParam: string) => void
  selectionEnabled: boolean
}

type UseTemplateReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  filterLabelProps: any
  selectedItems: any[]
}

const idFunction = rowData => rowData.guid

export const useTemplateTableProps = ({
  data,
  fetchMore,
  handleRowClick,
  setSortParams,
  selectionEnabled,
}: UseTemplateInput): UseTemplateReturn => {
  const { t } = useTranslation(['dlp/common'])
  const { canUpdate } = useDlpSettingsPermissions()
  const columns = useMemo(
    () => [
      {
        label: t('setting.template.columns.templateName'),
        dataKey: TEMPLATE_FIELDS.NAME,
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent label={t('setting.template.filter.name')} />,
        width: 80,
      },
      {
        label: t('setting.template.columns.description'),
        dataKey: TEMPLATE_FIELDS.DESCRIPTION,
        // temporary disable sorting for description column, regarding Jira-ticket DLP-5159 comments
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        // temporary disable filtering for description column, regarding Jira-ticket DLP-5159 comments
        // renderFilter: () => <DescriptionFilterComponent label={t('setting.template.filter.description')} />,
        width: 100,
      },
      {
        label: t('setting.template.columns.source'),
        dataKey: TEMPLATE_FIELDS.TYPE,
        sortable: true,
        show: false,
        persistent: false,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <SourceFilterComponent label={t('setting.template.filter.source')} />,
        width: 20,
      },
      // {
      //   label: t('setting.template.columns.status'),
      //   dataKey: 'status',
      //   sortable: true,
      //   show: false,
      //   persistent: false,
      //   filterType: FILTER_TYPES.BOOLEAN,
      //   renderFilter: () => (
      //     <StatusFilterComponent label={t('setting.template.filter.status')} option={t('setting.template.filter.inUse')} />
      //   ),
      //   width: 20,
      // },
      {
        label: t('setting.template.columns.regions'),
        dataKey: TEMPLATE_FIELDS.REGIONS,
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const regions = rowData['regions']
          return regions
            ? regions
                .split(',')
                .map((region: string) =>
                  Object.values(REGION).find(regionEntry => regionEntry.toUpperCase() === region.toUpperCase()),
                )
            : undefined
        },
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <RegionFilterComponent label={t('setting.template.filter.regions')} />,
        width: 100,
      },
      {
        label: t('setting.template.columns.informationType'),
        dataKey: TEMPLATE_FIELDS.INFO_TYPES,
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const infoTypes = rowData['infoTypes']
          return infoTypes
            ? infoTypes
                .split(',')
                .map((infoType: string) => {
                  const value = Object.keys(INFO_TYPES).find(
                    infoTypeEntry => infoTypeEntry.toUpperCase() === infoType.trim().toUpperCase(),
                  )
                  return INFO_TYPES[value]
                })
                .join(', ')
            : undefined
        },
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <InfoTypeFilterComponent label={t('setting.template.filter.infoTypes')} />,
        width: 100,
      },
      {
        label: t('setting.template.columns.dataTypesIncluded'),
        dataKey: TEMPLATE_FIELDS.DATA_ENTITIES,
        // temporary disable sorting for dataTypesIncluded column, regarding Jira-ticket DLP-5159 comments
        sortable: false,
        show: true,
        persistent: false,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const dataEntities = rowData['dataEntities']
          const dataEntityNames = dataEntities.map(dataEntity => dataEntity.name)
          return dataEntityNames ? dataEntityNames.join(', ') : undefined
        },
        filterType: FILTER_TYPES.QUICK_SEARCH,
        // temporary disable filtering for dataTypesIncluded column, regarding Jira-ticket DLP-5159 comments
        // renderFilter: () => <DataEntitiesFilterComponent label={t('setting.template.filter.dataEntities')} />,
        width: 200,
      },
      // {
      //   label: t('setting.template.columns.created'),
      //   dataKey: 'created',
      //   sortable: true,
      //   show: false,
      //   persistent: false,
      //   filterType: FILTER_TYPES.DATE_RANGE,
      //   renderFilter: () => <DateCreatedFilterComponent label={t('setting.template.filter.dateCreated')} />,
      //   width: 100,
      // },
      // {
      //   label: t('setting.template.columns.updated'),
      //   dataKey: 'updated',
      //   sortable: true,
      //   show: false,
      //   persistent: false,
      //   filterType: FILTER_TYPES.DATE_PICKER,
      //   renderFilter: () => <DateModifiedFilterComponent label={t('setting.template.filter.dateModified')} />,
      //   width: 100,
      // },
    ],
    [t],
  )

  const isRowLoaded = (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false

  // const onLoadMoreRows = useCallback(
  //   async ({ startIndex, stopIndex }) => {
  //     const variables = {
  //       variables: { cursor: startIndex === 0 ? undefined : data?.usersInGroup?.cursor, max: stopIndex - startIndex + 1 },
  //     }

  //     await fetchMore(variables)
  //   },
  //   [data?.usersInGroup?.cursor, fetchMore],
  // )

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.cursor },
      }

      await fetchMore(variables)
    },
    [fetchMore, data],
  )
  // const onLoadMoreRows = useCallback(
  //   async ({ startIndex, stopIndex }) => {
  //     const variables = {
  //       variables: { cursor: startIndex === 0 ? undefined : data?.cursor },
  //     }

  //     fetchMore ? await fetchMore(variables) : console.debug('no fetchMore function')
  //   },
  //   [fetchMore, data],
  // )

  const infinitLoader = {
    rowCount: data?.totals?.elements ?? 0,
    isRowLoaded: isRowLoaded,
    loadMoreRows: onLoadMoreRows,
    threshold: 30,
    minimumBatchSize: 20,
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const sortingProps = useSort(DEFAULT_FIELD, 'asc')
  const { sort, sortDirection } = sortingProps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSortParams(`${sort} ${sortDirection?.toUpperCase()}`), [sort, sortDirection])

  const selectedProps = useSelected('guid')
  console.log('displayedColumns', displayedColumns)
  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => canUpdate && <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  // const filteredData = useClientSearch({ data?.elements , searchColumns: ['name', 'description'], searchString })
  const filterProps = useFilter({})
  // filterProps?.onSetFilter()
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const tableProps = {
    noDataPlaceholder: t('noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps: selectionEnabled ? selectedProps : undefined,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
  }

  const selectedItems = useMemo(() => {
    return data?.elements?.filter(i => selectedProps.selected.includes(idFunction(i)))
  }, [selectedProps.selected, data])

  return { tableProps, providerProps, filterLabelProps, selectedItems }
}
