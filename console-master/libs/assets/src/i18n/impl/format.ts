import i18n from 'i18next'
import moment from 'moment'
import numbro from 'numbro'

export enum I18nFormats {
  Date = 'date',
  DateShort = 'date-short',
  Time = 'time',
  DateTime = 'datetime',
  DateTimeShort = 'datetime-short',
  DateTimeUTC = 'datetime-utc',
  DateTimeRelative = 'datetime-relative',
  DateTimeForEvents = 'datetime-humanized',
  Number = 'number',
  Currency = 'currency',
  SINumber = 'si-number',
}

export enum I18nFormatCodes {
  Date = 'll',
  DateShort = 'L',
  Time = 'LT',
  DateTime = 'lll',
}

const I18nFormatAliases = {
  [I18nFormats.Date]: I18nFormatCodes.Date,
  [I18nFormats.DateShort]: I18nFormatCodes.DateShort,
  [I18nFormats.Time]: I18nFormatCodes.Time,
  [I18nFormats.DateTime]: I18nFormatCodes.DateTime,
}

const I18nFormatTranslate = {
  dateTimeShort: () => i18n.t('formats:datetime.short'),
}

const specifier = formatStr => I18nFormatAliases[formatStr] || formatStr

const date1Min = 60000
const date45Min = 2700000
const dateTodayStart = moment().startOf('day')
const dateTodayEnd = moment().endOf('day')
const formatHumanizedDate = (value, useRelativeFeature = false) => {
  let m = moment(value)
  if (m < dateTodayStart || m > dateTodayEnd) {
    return m.format(I18nFormatTranslate.dateTimeShort())
  }
  const current = moment()
  m = useRelativeFeature ? moment.max(current, m) : moment.min(current, m)
  const diff = useRelativeFeature ? m.diff(current) : current.diff(m)
  if (diff >= date45Min) {
    return m.format(specifier(I18nFormats.Time))
  }
  if (diff < date1Min) {
    useRelativeFeature ? m.add(date1Min - diff) : m.subtract(date1Min - diff, 'ms')
  }
  return m.fromNow()
}

const format = (value: any, formatStr: string, lng?: string, options?: any) => {
  switch (formatStr) {
    case I18nFormats.Date:
    case I18nFormats.Time:
    case I18nFormats.DateTime:
    case I18nFormats.DateShort:
      return moment(value).format(specifier(formatStr))
    case I18nFormats.DateTimeShort:
      return moment(value).format(I18nFormatTranslate.dateTimeShort())
    case I18nFormats.DateTimeUTC:
      return moment.utc(value).toISOString()
    case I18nFormats.DateTimeRelative:
      return moment(value).fromNow()
    case I18nFormats.DateTimeForEvents:
      return formatHumanizedDate(value)
    case I18nFormats.Number:
      return numbro(value).format({ thousandSeparated: true })
    case I18nFormats.Currency:
      return numbro(value).formatCurrency({ mantissa: 2 })
    default:
      return value
  }
}

format.specifier = specifier

const aliases = {
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-PT',
}
format.supportedFormatLanguages = new Set(['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'pt-PT'])

// example of how to include other languages numbers formatting
// append the 'lng' query param to switch languages
// i.e. for Japanese, use http://localhost:4200/?lng=ja
// and uncomment the import below:
// import languageJapanese from 'numbro/languages/ja-JP';
// numbro.registerLanguage(languageJapanese);

const numbroLanguages = {
  'de-DE': () => import('numbro/languages/de-DE'),
  'es-ES': () => import('numbro/languages/es-ES'),
  'fr-FR': () => import('numbro/languages/fr-FR'),
  'it-IT': () => import('numbro/languages/it-IT'),
  'ja-JP': () => import('numbro/languages/ja-JP'),
  'ko-KR': () => import('numbro/languages/ko-KR'),
  'pt-BR': () => import('numbro/languages/pt-BR'),
  'pt-PT': () => import('numbro/languages/pt-PT'),
}
export const dateFormats = {
  DateShort: moment.localeData().longDateFormat(I18nFormatCodes.DateShort),
}
const onLanguageChange = async lang => {
  lang = aliases[lang] || lang
  const langWithFallback = format.supportedFormatLanguages.has(lang) ? lang : 'en-US'
  moment.locale(langWithFallback)
  dateFormats.DateShort = moment.localeData().longDateFormat(I18nFormatCodes.DateShort)
  const supplementalNumbro = numbroLanguages[langWithFallback]
  if (supplementalNumbro) {
    numbro.registerLanguage((await supplementalNumbro()).default)
  }
  numbro.setLanguage(langWithFallback)
}

// add language change hook for format
format.initialized = i18n.on('languageChanged', onLanguageChange)

export { format, specifier, onLanguageChange, formatHumanizedDate }
