/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import memoizeOne from 'memoize-one'

import type { Theme } from '@material-ui/core'

type ChartListColor = {
  thumbBackgroundColor: string
  scrollbarColor: string
}

type Colors = {
  chartListColor: ChartListColor
}

const getTypedColor = (theme: Theme, lmColor: string, dmColor: string): string => {
  return theme.palette.type === 'light' ? lmColor : dmColor
}

const getChartListColor = (theme: Theme): ChartListColor => {
  return {
    thumbBackgroundColor: getTypedColor(theme, theme.palette.grey[300], theme.palette.grey[300]),
    scrollbarColor: getTypedColor(theme, theme.palette.grey[300], theme.palette.grey[300]),
  }
}

const getColors = memoizeOne(
  (theme: Theme): Colors => {
    return {
      chartListColor: getChartListColor(theme),
    }
  },
)

/**
 * Returns custom chart colors using provided theme.
 *
 * @param theme custom theme
 */
export const useChartColors = (theme: Theme): Colors => {
  return getColors(theme)
}
