import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import React from 'react'

import LaunchDarklyClient from '../../services/launchdarkly'
import Storage from '../../Storage'
import ConditionalRoute from './components/Conditional'
import ForbiddenRedirect from './components/Forbidden'

const ProtectedRoute = props => {
  // Identify logged in user with LD using setUser() util.
  // The setUser() util issues ldClient.identify() only if logged in user is different than
  // the last user ldClient knows.
  LaunchDarklyClient.setUser(props.ldClient, Storage.getUserId(), Storage.getVpiRegion())

  return (
    <ConditionalRoute {...props} isTrue={props.hasPermission} trueElement={props.trueElement} falseElement={ForbiddenRedirect} />
  )
}

export default withLDConsumer()(ProtectedRoute)
