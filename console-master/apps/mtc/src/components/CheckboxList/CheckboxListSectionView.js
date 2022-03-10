import { capitalize } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import CheckboxListRowView from './CheckboxListRowView'

const CheckboxListSectionView = ({ headerKey, options, onChange, onHeaderChange, selected }) => {
  const CheckboxListRows = options.map(option => {
    return (
      <CheckboxListRowView
        headerKey={headerKey}
        className="checkbox-list-row"
        {...option}
        key={option.id}
        onChange={onChange}
        checked={selected.indexOf(option.id) !== -1}
      />
    )
  })

  return [
    <CheckboxListRowView
      headerKey={headerKey}
      key={`checkbox-list-header-${headerKey}`}
      id={headerKey}
      className="checkbox-list-header-row"
      label={capitalize(headerKey)}
      onChange={onHeaderChange}
      checked={options.length === selected.length}
      indeterminate={options.length !== selected.length && selected.length > 0}
    />,
    ...CheckboxListRows,
  ]
}

CheckboxListSectionView.propTypes = {
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  selected: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onHeaderChange: PropTypes.func,
  headerKey: PropTypes.string,
}

export default CheckboxListSectionView
