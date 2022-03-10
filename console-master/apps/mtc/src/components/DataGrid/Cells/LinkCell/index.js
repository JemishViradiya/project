import { template as templateCompiler } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'

const LinkCell = props => {
  const { row, template } = props
  return row.value !== null ? <Link to={templateCompiler(template)({ id: row.row.id })}>{row.value}</Link> : <span>—</span>
}

export default LinkCell
