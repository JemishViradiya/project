//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { useTranslation } from 'react-i18next'

import { ConnectorHealth, EnrollmentIncompleteReason } from '@ues-data/gateway'
import { BasicCircle, BasicPending, BasicRefresh, StatusHigh, StatusLow, StatusMedium } from '@ues/assets'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import useStyles from './styles'
import type { UseConnectorStatusFn } from './types'

export const useConnectorStatus: UseConnectorStatusFn = ({ health, connector }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()

  const connectorHealth = health ?? connector?.health?.health
  const isLabelConnected =
    connector?.upgradeAvailable === false &&
    connector?.maintenanceRequired === false &&
    connectorHealth !== undefined &&
    connectorHealth !== ConnectorHealth.Red

  const isNotEnrolled = (reason: EnrollmentIncompleteReason) =>
    connector?.enrolled?.value === false && connector?.enrolled?.enrollmentIncompleteReason === reason

  if (isNotEnrolled(EnrollmentIncompleteReason.Pending)) {
    return { message: t('connectors.pendingEnrollment'), className: classes.warning, Icon: BasicPending }
  }

  if (isNotEnrolled(EnrollmentIncompleteReason.Expired)) {
    return { message: t('connectors.failedToCompleteEnrollment'), className: classes.error, Icon: StatusHigh }
  }

  if (connector?.maintenanceRequired || connectorHealth === ConnectorHealth.Yellow) {
    return { message: t('connectors.labelAttentionRequired'), className: classes.warning, Icon: StatusMedium }
  }

  if (connector?.upgradeAvailable) {
    return { message: t('connectors.rebootRequiredTooltip'), className: classes.warning, Icon: BasicRefresh }
  }

  if (isLabelConnected || connectorHealth === ConnectorHealth.Green) {
    return { message: t('connectors.labelConnected'), className: classes.success, Icon: StatusLow }
  }

  if (connectorHealth === ConnectorHealth.Red) {
    return { message: t('dashboard.failure'), className: classes.error, Icon: StatusHigh }
  }

  return { message: t('connectors.unknownStatus'), className: classes.default, Icon: BasicCircle }
}
