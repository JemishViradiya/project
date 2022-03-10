import React from 'react'

import OldCard from '../OldCard'

require('./PartnerUserList.scss')

const PartnerUsersByPartnerList = props => {
  const { data, loading } = props
  return (
    <div id="partner-user-list-by-partner">
      <OldCard loading={loading}>
        <h3>List of Partner Users</h3>
        {data !== null &&
          data.map(value => {
            return [
              <div key="partner-user-list-div" className="list-row">
                <p>{value.name}</p>
                <p>{value.role}</p>
              </div>,
              <hr key="partner-user-list-hr" />,
            ]
          })}
      </OldCard>
    </div>
  )
}

export default PartnerUsersByPartnerList
