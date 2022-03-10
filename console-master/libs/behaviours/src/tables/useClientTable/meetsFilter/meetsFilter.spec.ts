import { meetsFilter } from './meetsFilter'
import { FILTER_TYPES, OPERATOR_VALUES } from './meetsFilter.constants'

const { RADIO, CHECKBOX, DATE_PICKER, DATE_RANGE, DATETIME_RANGE, NUMERIC, NUMERIC_RANGE, QUICK_SEARCH } = FILTER_TYPES

const { LESS_OR_EQUAL, BEFORE_OR_EQUAL, CONTAINS } = OPERATOR_VALUES

describe('meetsFilter', () => {
  // radio
  it('evaluates radio filter', () => {
    const data = ['one', 'two', 'three', 'two']
    const filterValue = { value: 'two', label: 'two' }
    const result = data.filter(el => {
      return meetsFilter(el, filterValue, RADIO)
    })
    expect(result).toEqual(['two', 'two'])
  })

  // checkbox
  it('evaluates checkbox filter', () => {
    const data = ['cupcake', 'cake', 'cookies', 'cake', 'pie']
    const filterValue = {
      value: ['cake', 'cookies'],
    }
    const result = data.filter(el => meetsFilter(el, filterValue, CHECKBOX))
    expect(result).toEqual(['cake', 'cookies', 'cake'])
  })
  // date picker
  it('evaluates date picker filter', () => {
    const data = ['1/23/20', '1/31/20', '5/9/15']
    const date = '1/23/20'
    const result = data.filter(el => {
      const filterValue = {
        value: date,
        operator: BEFORE_OR_EQUAL,
        label: date,
      }
      return meetsFilter(el, filterValue, DATE_PICKER)
    })
    expect(result).toEqual(['1/23/20', '5/9/15'])
  })
  // date range
  it('evaluates date range filter', () => {
    const data = ['1/23/20', '1/31/20', '5/9/15']
    const minDate = '1/31/19'
    const maxDate = '1/31/20'
    const result = data.filter(el => {
      const filterValue = { minDate, maxDate }
      return meetsFilter(el, filterValue, DATE_RANGE)
    })
    expect(result).toEqual(['1/23/20', '1/31/20'])
  })
  // date-time range
  it('evaluates date-time range filter', () => {
    const data = ['2020-01-01T01:23:45Z', '2020-01-02T05:43:21Z', '2020-01-03T01:23:45Z']
    const minDatetime = '2020-01-01T01:23:45Z'
    const maxDatetime = '2020-01-02T05:43:21Z'

    const result = data.filter(el => {
      const filterValue = { minDatetime, maxDatetime }
      return meetsFilter(el, filterValue, DATETIME_RANGE)
    })
    expect(result).toEqual(['2020-01-01T01:23:45Z', '2020-01-02T05:43:21Z'])
  })
  // numeric range
  it('evaluates numeric range filter', () => {
    const data = [1, 2, 3, 4, 2]
    const filterValue = { value: [2, 3] }
    const result = data.filter(el => {
      return meetsFilter(el, filterValue, NUMERIC_RANGE)
    })

    expect(result).toEqual([2, 3, 2])
  })
  // numeric
  it('evaluates numeric filter', () => {
    const data = [1, 2, 3, 4, 2]
    const number = 3
    const result = data.filter(el => {
      const filterValue = {
        value: number,
        operator: LESS_OR_EQUAL,
      }
      return meetsFilter(el, filterValue, NUMERIC)
    })

    expect(result).toEqual([1, 2, 3, 2])
  })
  // quick search
  it('evaluates quick search filter', () => {
    const data = ['one', 'two', 'three']
    const value = 't'
    const result = data.filter(el => {
      const filterValue = { operator: CONTAINS, value }
      return meetsFilter(el, filterValue, QUICK_SEARCH)
    })

    expect(result).toEqual(['two', 'three'])
  })
  // other + failed
  it('evaluates unrecognized filter', () => {
    const data = ['one', 'two', 'three']
    const filterValue = 'two'
    const result = data.filter(el => meetsFilter(el, filterValue, 'NotAValidFilter'))
    expect(result).toEqual([])
  })
})
