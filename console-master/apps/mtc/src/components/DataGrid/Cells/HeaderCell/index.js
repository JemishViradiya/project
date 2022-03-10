import React from 'react'

const HeaderCell = props => {
  const { name } = props
  return (
    <div>
      {name} <span className="asc hidden" />
    </div>
  )
}

export default HeaderCell
