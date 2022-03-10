//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { MAP_KEY_SEPARATOR } from './constants'

export const makeKeyToSliderRangeMap = (range: number[], fromSliderValue = false) => {
  const sliderRange = fromSliderValue ? range : [range[0], range[1] + 1]

  return sliderRange.join(MAP_KEY_SEPARATOR)
}
