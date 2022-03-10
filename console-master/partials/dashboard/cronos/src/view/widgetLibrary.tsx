//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { useMemo } from 'react'

import { useBisChartLibrary } from '@ues-bis/dashboard'
import { useGatewayChartLibrary } from '@ues-gateway/dashboard'
import { useDlpChartLibrary } from '@ues-info/dashboard'
import { useMtdChartLibrary } from '@ues-mtd/dashboard'

export const useWidgetLibrary = () => {
  const mtdChartLibrary = useMtdChartLibrary()
  const gatewayChartLibrary = useGatewayChartLibrary()
  const bisChartLibrary = useBisChartLibrary()
  const dlpChartLibrary = useDlpChartLibrary()
  return useMemo(() => Object.assign({}, gatewayChartLibrary, bisChartLibrary, mtdChartLibrary, dlpChartLibrary), [
    gatewayChartLibrary,
    bisChartLibrary,
    mtdChartLibrary,
    dlpChartLibrary,
  ])
}
