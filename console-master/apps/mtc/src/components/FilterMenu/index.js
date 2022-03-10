import PropTypes from 'prop-types'
import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { MenuItem as FilterMenuItem } from '../MenuItem'

require('./FilterMenu.scss')

const FilterMenu = props => {
  const containerStyle = {
    width: props.width ? props.width : '100%',
    height: props.height ? props.height : '100%',
  }
  return (
    <div className="filter-menu-container" style={containerStyle}>
      <FormControl disabled={props.readOnly} className="filter-menu-form-control">
        <InputLabel htmlFor="outlined-filter-menu">Add Filter...</InputLabel>
        <Select
          value={props.filterValue}
          onChange={props.onFilterChange}
          inputProps={{
            name: 'filter',
            id: 'outlined-filter-menu',
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {props.menuOptions.length > 0
            ? props.menuOptions.map(menuOption => (
                <MenuItem key={menuOption.key} value={menuOption.key}>
                  {menuOption.label}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
      {props.menuItems.length > 0 ? (
        <div className="menu-item-list-container">
          {props.menuItems.map(item => (
            <FilterMenuItem
              id={item.id}
              key={item.id}
              closeIcon
              title={item.title}
              description={item.description}
              onClose={item.onClose ? item.onClose : props.onClose}
              onSelect={item.onSelect ? item.onSelect : props.onSelect}
              selected={props.selectedItemId === item.id || false}
              disabled={item.disabled || props.readOnly || false}
            />
          ))}
        </div>
      ) : (
        <div className="empty-filter-menu">
          <p>Make a selection from the menu above...</p>
        </div>
      )}
    </div>
  )
}

FilterMenu.propTypes = {
  readOnly: PropTypes.bool,
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  height: PropTypes.string,
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      onClose: PropTypes.func,
      closeIcon: PropTypes.bool,
      description: PropTypes.string,
      disabled: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onSelect: PropTypes.func,
      title: PropTypes.string,
    }),
  ),
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selectedItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.string,
}

FilterMenu.defaultProps = {
  filterValue: '',
  menuOptions: [],
  menuItems: [],
}

export default FilterMenu
