import './moment'

import moment from 'moment'

describe('fromNow moment test', () => {
  // hardcoded the test date due to this bug: https://github.com/moment/moment/issues/5398
  const day = new Date(2021, 0, 20)
  const start = moment(day)

  it('30 days ago', () => {
    expect(start.from(start.clone().add(30, 'days'))).toEqual('30 days ago', '30 days = 30 days ago')
  })
})
