//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import i18n from 'i18next'

import { I18nFormats } from '@ues/assets'

export const kiloByte = 1024

export const formatBytes = (bytes: number | undefined, decimals = 2, customIndex?: number | undefined): number => {
  if (!bytes) return 0

  const dm = decimals < 0 ? 0 : decimals
  const index = customIndex ?? Math.floor(Math.log(bytes) / Math.log(kiloByte))

  return parseFloat((bytes / Math.pow(kiloByte, index)).toFixed(dm))
}

export const formatTimestamp = (timestamp: string | number | undefined, pattern = I18nFormats.DateTimeShort): string => {
  if (!timestamp) return '-'

  return i18n.format(Number(timestamp), pattern)
}
