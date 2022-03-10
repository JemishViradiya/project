import React from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { MobileProtectData } from '@ues-data/mtd'

import { MobileThreatsByCategoryLineChart } from './MobileThreatsByCategoryLineChart'
import { MobileThreatsLineChart } from './MobileThreatsLineChart'

export const MobileAppThreatsLineChart: React.FC<ChartProps> = ({ id, height, globalTime }) => {
  return (
    <MobileThreatsLineChart
      category={MobileProtectData.MobileThreatEventCategory.APPLICATION}
      height={height}
      globalTime={globalTime}
      id={id}
    />
  )
}

export const MobileNetworkThreatsLineChart: React.FC<ChartProps> = ({ id, height, globalTime }) => {
  return (
    <MobileThreatsLineChart
      category={MobileProtectData.MobileThreatEventCategory.NETWORK}
      height={height}
      globalTime={globalTime}
      id={id}
    />
  )
}

export const MobileDeviceSecurityThreatsLineChart: React.FC<ChartProps> = ({ id, height, globalTime }) => {
  return (
    <MobileThreatsLineChart
      category={MobileProtectData.MobileThreatEventCategory.DEVICE_SECURITY}
      height={height}
      globalTime={globalTime}
      id={id}
    />
  )
}

export const MobileThreatsSummaryLineChart: React.FC<ChartProps> = ({ id, height, globalTime }) => {
  return <MobileThreatsByCategoryLineChart height={height} globalTime={globalTime} id={id} />
}
