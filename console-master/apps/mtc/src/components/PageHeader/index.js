import React from 'react'

require('./PageHeader.scss')

const PageHeader = props => {
  const { children } = props
  return <div className="page-header-container">{children}</div>
}

export default PageHeader
