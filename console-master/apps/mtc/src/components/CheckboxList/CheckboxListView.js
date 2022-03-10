import PropTypes from 'prop-types'
import React from 'react'

import CheckboxListSectionView from './CheckboxListSectionView'

const CheckboxListView = ({ options, selected, onChange, onHeaderChange }) => (
  <div className="checkbox-list">
    {Object.keys(options).map(optionKey => (
      <CheckboxListSectionView
        key={optionKey}
        headerKey={optionKey}
        options={options[optionKey]}
        onChange={onChange}
        onHeaderChange={onHeaderChange}
        selected={selected[optionKey]}
      />
    ))}
  </div>
)

CheckboxListView.propTypes = {
  options: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))),
  selected: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  onChange: PropTypes.func,
  onHeaderChange: PropTypes.func,
}

export default CheckboxListView
