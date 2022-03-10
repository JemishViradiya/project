/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FontSizeProperty } from 'csstype'

export const remToPx = (remStr: FontSizeProperty<string | number>): number | string => {
  try {
    if (String(remStr).indexOf('px') > 0) return Number(String(remStr).replace('px', ''))
    return Number(String(remStr).replace('rem', '')) * 16
  } catch (e) {
    console.error('Error converting rem to px', e)
    return remStr
  }
}
