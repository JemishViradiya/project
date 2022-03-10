import i18n from 'i18next'
import moment from 'moment'

const tKeyLastCountDays = 'dashboard.date.lastDays'

export const getDateAndTime = datetime => {
  moment.locale(i18n.language)
  const localeData = moment.localeData()
  return moment(datetime).format(localeData.longDateFormat('lll'))
}
export const Periods = Object.freeze({
  LAST_MONTH: { key: 'LAST_MONTH', value: tKeyLastCountDays, daysNumber: 30 },
  LAST_WEEK: { key: 'LAST_WEEK', value: tKeyLastCountDays, daysNumber: 7 },
  LAST_DAY: { key: 'LAST_DAY', value: 'dashboard.date.last24Hours', daysNumber: 1 },
  LAST_HOUR: { key: 'LAST_HOUR', value: 'dashboard.date.lastHour' },
  LAST_CUSTOM_DAYS: { key: 'LAST_CUSTOM_DAYS', value: '' },
  CUSTOM: { key: 'CUSTOM', value: 'common.custom' },
})

export const isRetentionPeriodCustom = dataRetentionPeriod =>
  dataRetentionPeriod !== Periods.LAST_DAY.daysNumber &&
  dataRetentionPeriod !== Periods.LAST_WEEK.daysNumber &&
  dataRetentionPeriod !== Periods.LAST_MONTH.daysNumber

export const getMaxPeriod = days => {
  return `Last ${days} days`
}

export const getCustomPeriod = days => {
  return { key: 'LAST_CUSTOM_DAYS', value: tKeyLastCountDays, daysNumber: days }
}

export const getRangeValue = (last = 'LAST_DAY', start = '', end = '', daysNumber = null) => {
  return {
    last,
    start,
    end,
    daysNumber,
  }
}

export const getRelatedKey = days => {
  for (const [key, value] of Object.entries(Periods)) {
    if (value.daysNumber === days) {
      return key
    }
  }
}

export const getReducedDate = (daysToSubtract, isUnix) => {
  if (!isUnix) {
    return moment().subtract(daysToSubtract, 'days').startOf('day')
  }
  return moment().subtract(daysToSubtract, 'days').startOf('day').unix()
}

export const getDateScope = dataRetentionPeriod => {
  const now = new Date()
  const startDate = moment(now).subtract(dataRetentionPeriod, 'days').startOf('day').unix().toString()
  const endDate = moment(now).endOf('day').unix().toString()

  return {
    startDate,
    endDate,
  }
}

const getRelativeRangeOf = (subAmount = 1, subUnits = 'hour', precision = 'minute') => {
  return moment().endOf(precision).subtract(subAmount, subUnits).startOf(precision).valueOf()
}

export const getRelativeRange = period => {
  switch (period) {
    case Periods.LAST_HOUR.key:
      return getRelativeRangeOf(1, 'hour', 'minute')
    case Periods.LAST_DAY.key:
      return getRelativeRangeOf(1, 'day', 'hour')
    case Periods.LAST_WEEK.key:
      return getRelativeRangeOf(1, 'week', 'day')
    case Periods.LAST_MONTH.key:
    default:
      return getRelativeRangeOf(1, 'month', 'day')
  }
}

export const getTimeRange = (timePeriod, t) => {
  if (!timePeriod) {
    return ''
  }
  const { last, start, end, daysNumber } = timePeriod
  if (last && last === Periods.LAST_CUSTOM_DAYS.key) {
    return t(tKeyLastCountDays, { count: daysNumber })
  } else if (last && last !== Periods.LAST_CUSTOM_DAYS.key && Periods[last]) {
    return t(Periods[last].value, { count: Periods[last].daysNumber })
  } else if (start && end) {
    return `${moment.unix(start).format('ll')} - ${moment.unix(end).format('ll')}`
  } else if (start) {
    return t('dashboard.date.sinceDate', { date: `${moment.unix(start).format('ll LTS')}` })
  } else {
    return ''
  }
}
