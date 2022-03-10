/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export function numSort(a: string, b: string) {
  const a1 = a.split('.')
  const b1 = b.split('.')
  const len = Math.max(a1.length, b1.length)

  for (let i = 0; i < len; i++) {
    const _a = +a1[i] || 0
    const _b = +b1[i] || 0
    if (_a === _b) continue
    else return _a > _b ? 1 : -1
  }
  return 0
}

export function alphaAscendingSort(a: string, b: string) {
  if (a > b) {
    return 1
  }
  if (b > a) {
    return -1
  }
  return 0
}
