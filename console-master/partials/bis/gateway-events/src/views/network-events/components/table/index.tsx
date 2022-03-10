import moment from 'moment'
import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useQueryParams } from '@ues-behaviour/react'
import { Permission } from '@ues-data/shared-types'
import type { BasicTableProps } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  ColumnPicker,
  InfiniteTable,
  InfiniteTableProvider,
  OPERATOR_VALUES,
  TableToolbar,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useSecuredContent,
  useSort,
} from '@ues/behaviours'

import { TABLE_MAX_RECORDS_COUNT, TRANSLATION_NAMESPACES } from '../../config'
import { useColumns } from '../../hooks/use-columns'
import { useLocalizedRiskLevels } from '../../hooks/use-risk-level-labels'
import { useTableData } from '../../hooks/use-table-data'
import { useTrainingStatus } from '../../hooks/use-training-status'
import { EndpointsContext } from '../../providers/endpoints-provider'
import { ColumnKey } from '../../types'
import { useStyles } from './styles'

export interface NetworkAnomalyTableProps {
  tableTitle?: React.ReactNode
  onRowClick?: (row: any) => void
  userIds?: string[]
  containerIds?: string[]
  hiddenColumns?: ColumnKey[]
}

const ToolbarContent: React.FC<{ total: number }> = ({ total }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const classNames = useStyles()
  const formattedTotalResults = total === TABLE_MAX_RECORDS_COUNT ? `${total}+` : total

  return (
    <div className={classNames.toolbarContent}>
      <Typography component="span" variant="body2">
        {t('bis/ues:gatewayAlerts.table.toolbar.totalResults', { total: formattedTotalResults })}
      </Typography>
    </div>
  )
}

const useFilterProps = () => {
  const riskLevelType = useQueryParams().get('riskLevel')
  const from = useQueryParams().get('from')
  const to = useQueryParams().get('to')

  const defaultFilters = useMemo(() => {
    const startDate = moment(Number(from))
    const endDate = moment(Number(to))

    const defaultFilters = {}
    if (riskLevelType) {
      defaultFilters[ColumnKey.Risk] = { value: [riskLevelType], operator: OPERATOR_VALUES.IS_IN }
    }

    if (from && startDate.isValid() && to && endDate.isValid()) {
      defaultFilters[ColumnKey.DetectionTime] = {
        minDate: startDate,
        maxDate: endDate,
        operator: OPERATOR_VALUES.IS_BETWEEN,
      }
    }
    return defaultFilters
  }, [riskLevelType, from, to])
  return useFilter(defaultFilters)
}

export const NetworkAnomalyTable: React.FC<NetworkAnomalyTableProps> = ({
  tableTitle,
  userIds,
  onRowClick,
  hiddenColumns,
  containerIds,
}) => {
  useSecuredContent(Permission.BIS_EVENTS_READ)

  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const columns = useColumns({ hiddenColumns, userIds })
  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('bis/ues:gatewayAlerts.table.columnPicker.title'),
  })

  const sortProps = useSort(ColumnKey.Risk, 'desc')
  const filterProps = useFilterProps()
  const localizedLabels = useLocalizedRiskLevels()
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, localizedLabels)

  const { data, loading, infinitLoader, total } = useTableData({ filterProps, sortProps, userIds, containerIds })
  const { data: { trainingStatus } = {} } = useTrainingStatus()

  const basicProps = useMemo(
    (): BasicTableProps => ({
      columns: displayedColumns,
      idFunction: row => row.id,
      loading,
      onRowClick,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
    }),
    [displayedColumns, loading, onRowClick, columnPickerProps],
  )

  const noDataPlaceholder = useMemo(() => {
    if (trainingStatus?.networkAnomalyDetection) return t('bis/ues:gatewayAlerts.table.noDataInTrainingModeDP')

    if (Object.keys(filterProps.activeFilters).length > 0) return t('bis/ues:gatewayAlerts.table.noDataWithFilters')
    return t('bis/ues:gatewayAlerts.table.noDataPlaceholder')
  }, [filterProps.activeFilters, t, trainingStatus?.networkAnomalyDetection])

  const classes = useStyles()

  const { registerEndpoints } = useContext(EndpointsContext)

  useEffect(() => {
    const ids = data.map(row => row.assessment.datapoint.source.containerId).filter(id => typeof id === 'string')
    registerEndpoints(...ids)
  }, [data, registerEndpoints])

  return useMemo(
    () => (
      <Box className={classes.container}>
        <TableToolbar
          begin={tableTitle ? tableTitle : null}
          end={<ToolbarContent total={total} />}
          bottom={<AppliedFilterPanel {...filterProps} {...filterLabelProps} />}
        />
        <InfiniteTableProvider basicProps={basicProps} sortingProps={sortProps} data={data} filterProps={filterProps}>
          <InfiniteTable infinitLoader={infinitLoader} noDataPlaceholder={noDataPlaceholder} />
        </InfiniteTableProvider>
      </Box>
    ),
    [
      basicProps,
      classes.container,
      data,
      filterLabelProps,
      filterProps,
      infinitLoader,
      noDataPlaceholder,
      sortProps,
      tableTitle,
      total,
    ],
  )
}
