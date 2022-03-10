import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import { RiskChip, useActorDPEnabled } from '@ues-bis/shared'
import type { GatewayAlertsQueryEvent } from '@ues-data/bis'
import { RiskLevelTypes } from '@ues-data/bis/model'
import { FeatureName, useFeatures } from '@ues-data/shared'
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
import { ResponseCell } from '../components/response-cell'
import { RiskFilter } from '../components/risk-filter'
import { UserCell } from '../components/user-cell'
import { TRANSLATION_NAMESPACES } from '../config'
import type { UserHrefFn } from '../types'
import { ColumnKey } from '../types'

const useStyles = makeStyles(theme => ({
  responseColumnTooltip: {
    marginLeft: theme.spacing(1),
  },
}))

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
  userHrefFn?: UserHrefFn
  isPassiveMode?: boolean
  userIds: string[]
  hiddenColumns?: ColumnKey[]
}

export const useColumns = ({ userHrefFn, isPassiveMode, userIds, hiddenColumns }: UseColumnsOptions) => {
  const { t, i18n } = useTranslation(TRANSLATION_NAMESPACES)
  const styles = useStyles()
  const { isEnabled } = useFeatures()
  const arrEnabled = isEnabled(FeatureName.ARR)
  const actorDPEnabled = useActorDPEnabled()

  return useMemo((): TableColumn<GatewayAlertsQueryEvent>[] => {
    const hiddenColumnsSet = new Set(hiddenColumns)

    const passiveModeTooltipTranslationKey = arrEnabled
      ? 'bis/ues:gatewayAlerts.columns.response.passiveModeTooltipArr'
      : 'bis/ues:gatewayAlerts.columns.response.passiveModeTooltip'

    return [
      {
        dataKey: ColumnKey.Risk,
        label: t('bis/ues:gatewayAlerts.table.headers.risk'),
        width: 145,
        sortable: true,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <RiskFilter userIds={userIds} />,
        renderCell: row =>
          !actorDPEnabled || (actorDPEnabled && row?.assessment?.identityAndBehavioralRisk?.level !== RiskLevelTypes.UNKNOWN) ? (
            <RiskChip riskLevel={row?.assessment?.identityAndBehavioralRisk?.level ?? RiskLevelTypes.UNKNOWN} t={t} />
          ) : null,
        hidden: hiddenColumnsSet.has(ColumnKey.Risk),
      },
      {
        dataKey: ColumnKey.Type,
        label: actorDPEnabled ? t('bis/ues:gatewayAlerts.table.headers.category') : t('bis/ues:gatewayAlerts.table.headers.type'),
        width: 120,
        renderCell: row =>
          row?.assessment?.identityAndBehavioralRisk?.level !== RiskLevelTypes.UNKNOWN
            ? t('bis/shared:risk.common.identityRisk')
            : '',
        hidden: hiddenColumnsSet.has(ColumnKey.Type),
      },
      {
        dataKey: ColumnKey.Detection,
        label: actorDPEnabled ? t('bis/shared:common.description') : t('bis/ues:gatewayAlerts.table.headers.detection'),
        width: 210,
        renderCell: row => <DetectionCell row={row} />,
        persistent: true,
        hidden: hiddenColumnsSet.has(ColumnKey.Detection),
      },
      {
        dataKey: ColumnKey.Response,
        label: t('bis/ues:gatewayAlerts.table.headers.response'),
        width: 300,
        filterType: FILTER_TYPES.CHECKBOX,
        renderCell: row => <ResponseCell row={row} />,
        renderLabel: () => (
          <>
            {t('bis/ues:gatewayAlerts.table.headers.response')}
            {/* TODO use Tooltip from behaviours if we have one in the future */}
            {isPassiveMode && (
              <Tooltip
                title={t(passiveModeTooltipTranslationKey)}
                aria-label={t('bis/ues:gatewayAlerts.columns.response.passiveModeTooltipAriaLabel')}
                placement="top"
                enterDelay={600}
              >
                <IconButton
                  className={styles.responseColumnTooltip}
                  size="small"
                  aria-label={t('bis/ues:gatewayAlerts.columns.response.passiveModeTooltipAriaLabel')}
                >
                  <BasicInfo />
                </IconButton>
              </Tooltip>
            )}
          </>
        ),
        hidden: hiddenColumnsSet.has(ColumnKey.Response),
      },
      {
        dataKey: ColumnKey.Device,
        label: t('bis/ues:gatewayAlerts.table.headers.device'),
        width: 160,
        renderCell: row => row?.assessment?.datapoint?.source?.deviceModel ?? '',
        hidden: hiddenColumnsSet.has(ColumnKey.Device),
      },
      {
        dataKey: ColumnKey.User,
        label: t('bis/ues:gatewayAlerts.table.headers.user'),
        width: 110,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <UserFilterComponent />,
        renderCell: row => <UserCell row={row} userHrefFn={userHrefFn} />,
        hidden: hiddenColumnsSet.has(ColumnKey.User),
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
  }, [hiddenColumns, arrEnabled, t, actorDPEnabled, userIds, isPassiveMode, styles.responseColumnTooltip, userHrefFn, i18n])
}
