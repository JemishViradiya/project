import moment from 'moment'
import React from 'react'

import { DATEFORMAT } from '../../../../constants/DateFormat'

const ResendInviteCell = props => {
  const { row, loading, resendInviteCallback, keyId } = props

  const onClick = () => {
    resendInviteCallback(row.row[keyId])
  }

  if (loading) {
    return <span>—</span>
  }
  if (row.value !== null && !loading) {
    return <span>{moment(row.value).format(DATEFORMAT.DATETIME)}</span>
  }
  if (row.value === null) {
    return (
      <span>
        N/A -{' '}
        <a className="resend-invite" onClick={onClick}>
          Resend Invite
        </a>
      </span>
    )
  }
}

export default ResendInviteCell
