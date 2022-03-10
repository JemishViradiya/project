/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

function getDataValue(max = 50) {
  return Math.floor(Math.random() * max + 1)
}

function getSeries(hours, seriesName) {
  let startTime = Date.now()
  const times = []
  for (let i = 0; i < hours; i++) {
    times.push(new Date((startTime -= 3600000)).toISOString())
  }

  const data = []
  times.forEach(function (t) {
    data.push({ value: [t, getDataValue()] })
  })

  return {
    series: seriesName,
    data: data,
  }
}

export function getData(seriesCount, hours) {
  const chartData = []
  for (let i = 1; i <= seriesCount; i++) {
    chartData.push(getSeries(hours, `series${i}`))
  }
  return chartData
}

export function getDataWithCustomColorPalette(hours) {
  const chartData = [getSeries(hours, 'low'), getSeries(hours, 'medium'), getSeries(hours, 'high'), getSeries(hours, 'critical')]
  return chartData.map(data => ({ ...data, colorKey: data.series }))
}

export function getPieData(sectorsCount) {
  const chartData = []
  for (let i = 1; i <= sectorsCount; i++) {
    chartData.push({ label: 'Label' + i, count: getDataValue() })
  }
  return chartData
}

export function getBarData(barsCount) {
  const chartData = []
  for (let i = 1; i <= barsCount; i++) {
    chartData.push({ label: 'Label' + i, count: getDataValue(1000) })
  }
  return chartData
}

export function getSegmentedBarData(barsCount, segmentsCount) {
  const chartData = []
  for (let i = 1; i <= barsCount; i++) {
    const barData = []
    for (let j = 1; j <= segmentsCount; j++) {
      barData.push(getDataValue(1000))
    }
    chartData.push({ label: 'Label' + i, counts: barData })
  }
  return chartData
}

export function getCustomPalette(theme) {
  return { ...theme.palette.chipAlert, unknown: theme.palette.grey[500] }
}

export function getStackedHorizontalBarData() {
  const rawData = [
    { datetime: 1605126600000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605130200000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605133800000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605137400000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605141000000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605144600000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605148200000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605151800000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605155400000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605159000000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605162600000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605166200000, low: 1, medium: 3, high: 5, critical: 1, total: 20 },
    { datetime: 1605169800000, low: 7, medium: 7, high: 10, critical: 14, total: 47 },
    { datetime: 1605173400000, low: 14, medium: 20, high: 0, critical: 10, total: 50 },
    { datetime: 1605177000000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605180600000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605184200000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605187800000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605191400000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605195000000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605198600000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605202200000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605205800000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
    { datetime: 1605209400000, low: 0, medium: 0, high: 0, critical: 0, total: 0 },
  ]

  return [
    {
      series: 'unknown',
      colorKey: 'unknown',
      data: rawData.map(d => [d.total - d.low - d.medium - d.high - d.critical, d.datetime]),
    },
    { series: 'low', colorKey: 'low', data: rawData.map(d => [d.low, d.datetime]) },
    { series: 'medium', colorKey: 'medium', data: rawData.map(d => [d.medium, d.datetime]) },
    { series: 'high', colorKey: 'high', data: rawData.map(d => [d.high, d.datetime]) },
    { series: 'critical', colorKey: 'critical', data: rawData.map(d => [d.critical, d.datetime]) },
  ]
}
