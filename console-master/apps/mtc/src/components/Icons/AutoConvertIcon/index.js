import moment from 'moment'
import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'

import { DATEFORMAT } from '../../../constants/DateFormat'
import Icon from './Icon'

require('./AutoConvertIcon.scss')

// Add functionality to calculate date.

const AutoConvertIcon = props => {
  const formattedDate = props.createdDate
    ? moment(props.createdDate).add(60, 'd').format(DATEFORMAT.DATE)
    : 'A date after this error is resolved'

  return (
    <Tooltip title={`Auto-converting to Customer on ${formattedDate}`}>
      <span className="convert-icon">
        <Icon />
      </span>
    </Tooltip>
  )
}

export default AutoConvertIcon
