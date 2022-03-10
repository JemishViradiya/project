/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

export type EnhancedChartEntry<TEnhancedChartEntry = unknown> = TEnhancedChartEntry & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

export type EnhancedChartOnInteractionFnArgs<TEnhancedChartEntry = unknown> = EnhancedChartEntry<TEnhancedChartEntry> & {
  // includes optional data point value, available for LineChart, PieChart
  dataPointValue?: [number, number] | number
}

export interface EnhancedChartProps<TEnhancedChartEntry> {
  data: EnhancedChartEntry<TEnhancedChartEntry>[]
  onInteraction?: (data: EnhancedChartOnInteractionFnArgs<TEnhancedChartEntry>) => void
}

export interface CustomPaletteChartProps<T> {
  customPalette?: { [key in keyof T]: string }
}

export interface CustomPaletteChartData {
  colorKey?: string
}

export type GaugeData = { value: number }
