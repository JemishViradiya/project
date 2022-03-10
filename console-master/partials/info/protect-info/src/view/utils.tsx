import React from 'react'
import { useTranslation } from 'react-i18next'

export const useBytesConverter = (fileSize: number, bytesConvert?: boolean) => {
  const { t } = useTranslation(['dlp/common', 'formats'])
  if (bytesConvert) {
    return fileSize < 1024
      ? t('formats:fileSizes.kiloBytes.abbreviation', { size: parseFloat((fileSize / 1024).toFixed(2)) })
      : fileSize < 1048576
      ? t('formats:fileSizes.megaBytes.abbreviation', { size: parseFloat((fileSize / 1048576).toFixed(2)) })
      : t('formats:fileSizes.gigaBytes.abbreviation', { size: parseFloat((fileSize / 1073741824).toFixed(2)) })
  }
  return fileSize < 1024
    ? t('formats:fileSizes.bytes.abbreviation', { size: fileSize })
    : fileSize < 1048576
    ? t('formats:fileSizes.kiloBytes.abbreviation', { size: parseFloat((fileSize / 1024).toFixed(2)) })
    : fileSize < 1048576 * 1024
    ? t('formats:fileSizes.megaBytes.abbreviation', { size: parseFloat((fileSize / 1048576).toFixed(2)) })
    : t('formats:fileSizes.gigaBytes.abbreviation', { size: parseFloat(((fileSize / 1048576) * 1024).toFixed(2)) })
}
