import React from 'react'

const View = () => <div>{'Hello eid/shared'}</div>

export const ViewRoutes = {
  path: '/eid/shared*',
  element: <View />,
}
