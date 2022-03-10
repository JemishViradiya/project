import moment from 'moment'

moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('d', 31) // see this bug: https://github.com/moment/moment/issues/5398
moment.relativeTimeThreshold('M', 12)
