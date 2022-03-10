import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'

import { ErrorBoundary } from '../../shared'
import EventInfoView from './EventInfoView'

const EventInfoDashboard = () => {
  const { id } = useParams()
  return (
    <ErrorBoundary>
      <EventInfoView eventId={decodeURIComponent(id)} />
    </ErrorBoundary>
  )
}

EventInfoDashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
}

export default EventInfoDashboard
