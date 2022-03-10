import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { RiskChip } from '@ues-bis/shared'
import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { RiskLevelTypes } from '@ues-data/bis/model'
import { BasicInfo, I18nFormats } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  DateRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useDateRangeFilter,
  useQuickSearchFilter,
  useTableFilter,
} from '@ues/behaviours'

import { DetectionCell } from '../components/detection-cell'
import { DeviceCell } from '../components/device-cell'
import { IdentityChallengeCell } from '../components/identity-challenge-cell'
import { RiskFilter } from '../components/risk-filter'
import { UserCell } from '../components/user-cell'
import { TRANSLATION_NAMESPACES } from '../config'
import { ColumnKey } from '../types'

const DetectionTimeFilterComponent: React.FC = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const filterProps = useTableFilter()
  const props = useDateRangeFilter({ filterProps, key: ColumnKey.DetectionTime })

  return useMemo(() => <DateRangeFilter label={t('bis/ues:gatewayAlerts.table.headers.detectionTime')} {...props} />, [t, props])
}

const UserFilterComponent: React.FC = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const filterProps = useTableFilter()
  const props = useQuickSearchFilter({ filterProps, key: ColumnKey.User, defaultOperator: OPERATOR_VALUES.CONTAINS })

  return useMemo(
    () => (
      <QuickSearchFilter
        label={t('bis/ues:gatewayAlerts.table.headers.user')}
        operators={STRING_OPERATORS.filter(operator => operator !== OPERATOR_VALUES.DOES_NOT_CONTAIN)}
        {...props}
      />
    ),
    [t, props],
  )
}

export interface UseColumnsOptions {
  userIds: string[]
  hiddenColumns?: ColumnKey[]
}

const useStyles = makeStyles(theme => ({
  responseColumnTooltip: {
    marginLeft: theme.spacing(1),
  },
}))

const tooltipText = 'bis/ues:gatewayAlerts.columns.risk.tooltipText'

export const useColumns = ({ userIds, hiddenColumns }: UseColumnsOptions) => {
  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES)
  const styles = useStyles()

  return useMemo((): TableColumn<GatewayAlertsQueryEvent>[] => {
    const hiddenColumnsSet = new Set(hiddenColumns)

    return [
      {
        dataKey: ColumnKey.Risk,
        label: t('bis/ues:gatewayAlerts.table.headers.risk'),
        width: 145,
        sortable: true,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <RiskFilter userIds={userIds} />,
        renderCell: row =>
          row?.assessment?.identityAndBehavioralRisk?.level !== RiskLevelTypes.UNKNOWN ? (
            <RiskChip riskLevel={row?.assessment?.identityAndBehavioralRisk?.level ?? RiskLevelTypes.UNKNOWN} t={t} />
          ) : null,
        renderLabel: () => (
          <>
            {t('bis/ues:gatewayAlerts.table.headers.risk')}
            <Tooltip title={t(tooltipText)} placement="top" enterDelay={600}>
              <IconButton className={styles.responseColumnTooltip} size="small" aria-label={t(tooltipText)}>
                <BasicInfo />
              </IconButton>
            </Tooltip>
          </>
        ),
        hidden: hiddenColumnsSet.has(ColumnKey.Risk),
      },
      {
        dataKey: ColumnKey.Detection,
        label: t('bis/ues:gatewayAlerts.table.headers.category'),
        width: 210,
        renderCell: row => <DetectionCell row={row} />,
        persistent: true,
        hidden: hiddenColumnsSet.has(ColumnKey.Detection),
      },
      {
        dataKey: ColumnKey.User,
        label: t('bis/ues:gatewayAlerts.table.headers.user'),
        width: 110,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <UserFilterComponent />,
        renderCell: row => <UserCell row={row} />,
        hidden: hiddenColumnsSet.has(ColumnKey.User),
      },
      {
        dataKey: ColumnKey.Device,
        label: t('bis/ues:gatewayAlerts.table.headers.device'),
        width: 160,
        renderCell: row => <DeviceCell row={row} />,
        hidden: hiddenColumnsSet.has(ColumnKey.Device),
      },
      {
        dataKey: ColumnKey.Response,
        label: t('bis/ues:gatewayAlerts.table.headers.identityChallenge'),
        width: 300,
        filterType: FILTER_TYPES.CHECKBOX,
        renderCell: row => <IdentityChallengeCell row={row} />,
        hidden: hiddenColumnsSet.has(ColumnKey.Response),
      },
      {
        dataKey: ColumnKey.DetectionTime,
        label: t('bis/ues:gatewayAlerts.table.headers.detectionTime'),
        width: 208,
        sortable: true,
        filterType: FILTER_TYPES.DATE_RANGE,
        renderFilter: () => <DetectionTimeFilterComponent />,
        renderCell: row => i18n.format(row.assessment.datetime, I18nFormats.DateTimeForEvents),
        hidden: hiddenColumnsSet.has(ColumnKey.DetectionTime),
      },
    ]
  }, [hiddenColumns, t, userIds, styles.responseColumnTooltip, i18n])
}
