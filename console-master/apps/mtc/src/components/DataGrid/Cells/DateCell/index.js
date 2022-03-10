import moment from 'moment'
import React from 'react'

import { DATEFORMAT } from '../../../../constants/DateFormat'

const DateCell = props => {
  const { row, loading } = props
  return row.value !== null && !loading ? <span>{moment(row.value).format(DATEFORMAT.DATETIME)}</span> : <span>—</span>
}

export default DateCell
