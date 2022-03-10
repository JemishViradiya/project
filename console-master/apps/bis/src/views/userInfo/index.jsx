import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useParams } from 'react-router-dom'

import StateProvider from '../../providers/StateProvider'
import { ErrorBoundary } from '../../shared'
import UserInfoView from './UserInfoView'

const UserInfoDashboard = memo(() => {
  const { id } = useParams()
  return (
    <ErrorBoundary>
      <StateProvider>
        <UserInfoView userId={decodeURIComponent(id)} />
      </StateProvider>
    </ErrorBoundary>
  )
})

UserInfoDashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
}

export default UserInfoDashboard
