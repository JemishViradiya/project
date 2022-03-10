import { useTranslation } from 'react-i18next'

import { GATEWAY_TRANSLATIONS_KEY } from '../config/translations'
import { formatBytes, kiloByte } from '../utils/formatters'

export enum Abbreviation {
  Bytes = 'Bytes',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
  PB = 'PB',
  EB = 'EB',
  ZB = 'ZB',
  YB = 'YB',
}

export const useBytesFormatterResolver = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'formats'])
  const byteUnitsNames = [
    'bytes',
    'kiloBytes',
    'megaBytes',
    'gigaBytes',
    'teraBytes',
    'petaBytes',
    'eksaBytes',
    'zettaBytes',
    'yottaBytes',
  ]

  return (bytes: number | undefined, decimals = 2, abbreviation?: Abbreviation, localized = true) => {
    const abbreviations = Object.values(Abbreviation)
    const optionalAbbreviationIndex = abbreviation ? abbreviations.indexOf(abbreviation) : undefined
    const abbreviationIndex = optionalAbbreviationIndex || Math.floor(Math.log(bytes) / Math.log(kiloByte))

    const value = formatBytes(bytes, decimals, optionalAbbreviationIndex)
    const unit = `formats:fileSizes.${byteUnitsNames[abbreviationIndex]}.abbreviation`

    return localized && value !== 0 ? `${value} ${t(unit)}` : `${value}`
  }
}
