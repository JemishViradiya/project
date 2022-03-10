import React from 'react'

const View = () => <div>{'Hello <%= fullName %>'}</div>

export const ViewRoutes = {
  path: '/<%= fullName %>*',
  element: <View />,
}
