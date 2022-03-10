import React from 'react'
import { Outlet } from 'react-router-dom'

const ActivationProfiles = React.memo(() => {
  return <Outlet />
})
ActivationProfiles.displayName = 'ActivationProfiles'

export default ActivationProfiles
