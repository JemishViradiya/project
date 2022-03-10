import moment from 'moment'
import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { useQueryParams } from '@ues-behaviour/react'
import { useActorDPEnabled } from '@ues-bis/shared'
import { OperatingMode } from '@ues-data/bis/model'
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
import { GeneralSettingsContext } from '../../providers/general-settings-provider'
import type { UserHrefFn } from '../../types'
import { ColumnKey } from '../../types'
import { useStyles } from './styles'

export interface GatewayAlertsTableProps {
  tableTitle?: React.ReactNode
  userHrefFn?: UserHrefFn
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

export const GatewayAlertsTable: React.FC<GatewayAlertsTableProps> = ({
  tableTitle,
  userHrefFn,
  userIds,
  onRowClick,
  hiddenColumns,
}) => {
  useSecuredContent(Permission.BIS_EVENTS_READ)

  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const actorDPEnabled = useActorDPEnabled()
  const { data: generalSettingData } = useContext(GeneralSettingsContext)
  const isPassiveMode = generalSettingData?.generalSettings?.tenantSettings?.operatingMode === OperatingMode.PASSIVE

  const columns = useColumns({ hiddenColumns, userHrefFn, isPassiveMode, userIds })
  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('bis/ues:gatewayAlerts.table.columnPicker.title'),
  })

  const sortProps = useSort(ColumnKey.Risk, 'desc')
  const filterProps = useFilterProps()
  const localizedLabels = useLocalizedRiskLevels()
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, localizedLabels)

  const { data, loading, infinitLoader, total } = useTableData({ filterProps, sortProps, userIds })
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
    if (trainingStatus?.networkAnomalyDetection)
      return actorDPEnabled
        ? t('bis/ues:gatewayAlerts.table.noDataInTrainingModeDP')
        : t('bis/ues:gatewayAlerts.table.noDataInTrainingMode')
    if (Object.keys(filterProps.activeFilters).length > 0) return t('bis/ues:gatewayAlerts.table.noDataWithFilters')
    return t('bis/ues:gatewayAlerts.table.noDataPlaceholder')
  }, [actorDPEnabled, filterProps.activeFilters, t, trainingStatus?.networkAnomalyDetection])

  const classes = useStyles()

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
