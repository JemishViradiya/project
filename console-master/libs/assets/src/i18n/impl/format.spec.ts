import moment from 'moment'

import { format, formatHumanizedDate, I18nFormats } from './format'

describe('i18n date/time format', () => {
  test('relative DateTimeForEvents', async () => {
    const formatType = I18nFormats.DateTimeForEvents

    // curent time
    expect(format(moment(), formatType)).toEqual('a minute ago')

    // past time
    expect(format(moment().subtract(20, 'seconds'), formatType)).toEqual('a minute ago')
    expect(format(moment().subtract(59, 'seconds'), formatType)).toEqual('a minute ago')
    expect(format(moment().subtract(60, 'seconds'), formatType)).toEqual('a minute ago')
    expect(format(moment().subtract(61, 'seconds'), formatType)).toEqual('a minute ago')
    expect(format(moment().subtract(60 + (moment.relativeTimeThreshold('s') as number), 'seconds'), formatType)).toEqual(
      '2 minutes ago',
    )
    expect(format(moment().subtract(44, 'minutes'), formatType)).toEqual('44 minutes ago')
    expect(format(moment().subtract(45, 'minutes'), formatType)).not.toEqual('45 minutes ago')

    // future time (should never happen but we can have small difference between server and client time)
    expect(format(moment().add(59, 'seconds'), formatType)).toEqual('a minute ago')
    expect(format(moment().add(2, 'minutes'), formatType)).toEqual('a minute ago')
    expect(format(moment().add(45, 'minutes'), formatType)).toEqual('a minute ago')
  })

  test('relative future formatHumanizedDate', async () => {
    // curent time
    expect(formatHumanizedDate(moment(), true)).toEqual('in a minute')

    // past time
    expect(formatHumanizedDate(moment().subtract(20, 'seconds'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().subtract(89, 'seconds'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().subtract(2, 'minutes'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().subtract(45, 'minutes'), true)).toEqual('in a minute')

    // future time
    expect(formatHumanizedDate(moment().add(59, 'seconds'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().add(60, 'seconds'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().add(61, 'seconds'), true)).toEqual('in a minute')
    expect(formatHumanizedDate(moment().add(60 + (moment.relativeTimeThreshold('s') as number), 'seconds'), true)).toEqual(
      'in 2 minutes',
    )
    expect(formatHumanizedDate(moment().add(45, 'minutes'), true)).not.toEqual('in 45 minutes')
  })
})
