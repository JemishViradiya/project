import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartHeader, Count } from '@ues-behaviour/dashboard'
import type { MobileProtectData } from '@ues-data/mtd'
import { queryEnabledDeviceCounts } from '@ues-data/mtd'
import { useStatefulAsyncQuery } from '@ues-data/shared'
import { DeviceMobile } from '@ues/assets'

import { useBackendState } from './hooks/useBackendState'
import { useStyles } from './styles'

function getMtdCount(enabledDevicesCounts: MobileProtectData.EnabledDeviceCount): number {
  return enabledDevicesCounts?.mtdDeviceCount
}

function getEcsCount(enabledDevicesCounts: MobileProtectData.EnabledDeviceCount): number {
  return enabledDevicesCounts?.ecsDeviceCount
}

export const EnabledDevicesChart: React.FC<ChartProps> = () => {
  const styles = useStyles()
  const { t } = useTranslation(['mtd/common'])

  const { data: enabledDevicesCounts, error } = useStatefulAsyncQuery(queryEnabledDeviceCounts)

  useBackendState(error)

  return (
    <div className={styles.chartContainer}>
      <ChartHeader className={styles.chartHeader}>
        <div>
          <Count
            count={enabledDevicesCounts ? getMtdCount(enabledDevicesCounts) : 0}
            icon={DeviceMobile}
            description={t('threats.enabledDevices', { count: getEcsCount(enabledDevicesCounts) })}
            showChange={false}
          />
        </div>
      </ChartHeader>
    </div>
  )
}
