const moment = require('moment')
const numbro = require('numbro')

const I18nFormats = Object.freeze({
  Date: 'date',
  DateShort: 'date-short',
  Time: 'time',
  DateTime: 'datetime',
  DateTimeShort: 'datetime-short',
  DateTimeUTC: 'datetime-utc',
  DateTimeRelative: 'datetime-relative',
  DateTimeForEvents: 'datetime-humanized',
  Number: 'number',
  Currency: 'currency',
})

const I18nFormatAliases = {
  [I18nFormats.Date]: 'll',
  [I18nFormats.DateShort]: 'L',
  [I18nFormats.Time]: 'LT',
  [I18nFormats.DateTime]: 'lll',
  // TODO: handle translations in next MR
  [I18nFormats.DateTimeShort]: 'MM/DD/YY h:mm A',
}

const specifier = formatStr => I18nFormatAliases[formatStr] || formatStr

const date1Min = 60000
const date45Min = 2700000
const dateTodayStart = moment().startOf('day')
const dateTodayEnd = moment().endOf('day')
const formatHumanizedDate = (value, useRelativeFeature = false) => {
  let m = moment(value)
  if (m < dateTodayStart || m > dateTodayEnd) {
    return m.format(specifier(I18nFormats.DateTime))
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

const format = (value, formatStr, lng, options) => {
  switch (formatStr) {
    case I18nFormats.Date:
    case I18nFormats.Time:
    case I18nFormats.DateTime:
    case I18nFormats.DateShort:
    case I18nFormats.DateTimeShort:
      return moment(value).format(specifier(formatStr))
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

format.supportedFormatLanguages = new Set(['en', 'en-US'])

module.exports.format = format
