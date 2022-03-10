import React, { memo } from 'react'
import { useRoutes } from 'react-router-dom'

import { Loading } from '@ues/behaviours'

const Route = {
  path: '/',
  element: <div>Nothing Here Yet!</div>,
}
const loading = { path: '/loading', element: <Loading /> }

export const AppRoutes = memo(() => {
  return useRoutes([loading, Route])
})

export default <AppRoutes />
