import moment from 'moment'
import React from 'react'

import AutoConvertIcon from '../../../Icons/AutoConvertIcon'
import NullCell from '../NullCell'
import ValueCell from '../ValueCell'

const AutoConversionCell = props => {
  const { row } = props
  const value = typeof props.value === 'undefined' ? row.value : props.value
  const { createdDateTime } = row.row._original

  let cell = <NullCell />

  if (value !== null && typeof value !== 'object' && typeof value !== 'undefined') {
    cell = (
      <ValueCell
        value={value}
        icon={moment(createdDateTime).add(46, 'days').isBefore(moment()) ? <AutoConvertIcon createdDate={createdDateTime} /> : null}
      />
    )
  }
  return cell
}

export default AutoConversionCell
