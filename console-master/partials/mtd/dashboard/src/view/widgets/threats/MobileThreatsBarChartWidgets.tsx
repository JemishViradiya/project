import React from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { MobileProtectData } from '@ues-data/mtd'

import { MobileThreatsBarChart } from './MobileThreatsBarChart'

export const MobileAppThreatsBarChart: React.FC<ChartProps> = ({ id, globalTime }) => {
  return (
    <MobileThreatsBarChart id={id} category={MobileProtectData.MobileThreatEventCategory.APPLICATION} globalTime={globalTime} />
  )
}

export const MobileNetworkThreatsBarChart: React.FC<ChartProps> = ({ id, globalTime }) => {
  return <MobileThreatsBarChart id={id} category={MobileProtectData.MobileThreatEventCategory.NETWORK} globalTime={globalTime} />
}

export const MobileDeviceSecurityThreatsBarChart: React.FC<ChartProps> = ({ id, globalTime }) => {
  return (
    <MobileThreatsBarChart id={id} category={MobileProtectData.MobileThreatEventCategory.DEVICE_SECURITY} globalTime={globalTime} />
  )
}
