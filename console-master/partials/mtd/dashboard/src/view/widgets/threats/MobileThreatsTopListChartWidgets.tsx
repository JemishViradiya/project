import React, { useMemo } from 'react'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { MobileProtectData } from '@ues-data/mtd'

import { MobileThreatsTopListChart } from './MobileThreatsTopListChart'

export const MaliciousAppTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.MALICIOUS_APP]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const SideLoadedAppTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.SIDELOADED_APP]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

/*
export const RestrictedAppTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.RESTRICTED_APP]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}
*/

export const InsecureWifiTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.INSECURE_WIFI]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const CompromisedNetworkTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.COMPROMISED_NETWORK]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const UnsupportedOsTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.UNSUPPORTED_OS]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const UnsupportedModelTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.UNSUPPORTED_MODEL]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const UnsupportedSecurityPatchTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.UNSUPPORTED_SECURITY_PATCH]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}

export const MobileThreatDetectionsTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return <MobileThreatsTopListChart eventTypes="all" height={height} globalTime={globalTime} />
  }, [globalTime, height])
}

export const UnsafeMessageTopListChart: React.FC<ChartProps> = ({ height, globalTime }) => {
  return useMemo(() => {
    return (
      <MobileThreatsTopListChart
        eventTypes={[MobileProtectData.MobileThreatEventType.UNSAFE_MESSAGE]}
        height={height}
        globalTime={globalTime}
      />
    )
  }, [globalTime, height])
}
