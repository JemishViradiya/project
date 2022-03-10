import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { GatewayAlertsQueryEvent } from '@ues-data/bis'

import { TRANSLATION_NAMESPACES } from '../../config'
import { DetectionCellContent } from './detection-cell-content'

export interface DetectionCellProps {
  row: GatewayAlertsQueryEvent
}

export const DetectionCell: React.FC<DetectionCellProps> = ({ row }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)

  const text = useMemo(() => t('bis/ues:gatewayAlerts.columns.detection.networkAnomaly'), [t])

  return <DetectionCellContent text={text} />
}
