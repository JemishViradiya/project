import moment from 'moment'

const makeDefaultValues = () => ({
  maxDate: moment().endOf('day'),
  minDate: moment().subtract(1, 'months').startOf('day'),
})

export const convertFilterDateRangeToRangeVariable = (value = makeDefaultValues()) => ({
  end: value.maxDate.unix().toString(),
  start: value.minDate.unix().toString(),
})
