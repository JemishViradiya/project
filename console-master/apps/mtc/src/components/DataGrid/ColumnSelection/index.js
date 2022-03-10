/*
	The <ColumnSelection /> component renders an icon that, when clicked, presents the user with a list of columns to show within the data table.
	Props:
		columns - An array of column objects used to display the available columns.
		columnSelectionChangeCallback - A callback function to notify the parent component of the column(s) selected.
*/
import { camelCase } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from '../../Checkbox'

require('./ColumnSelection.scss')

class ColumnSelection extends React.Component {
  state = {
    open: false,
  }

  _handleChange = event => {
    this.props.columnSelectionChangeCallback(event.target.name, event.target.checked)
  }

  _handleClick = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    return (
      <div id="data-table-column-selection">
        <span
          className={`icon-columns ${this.state.open ? 'open' : 'closed'}`}
          role="button"
          tabIndex={0}
          aria-label="data-table-column-selection-dropdown-button"
          id="data-table-column-selection-dropdown-button"
          onClick={this._handleClick}
        />
        <div className={`checkbox-dropdown ${this.state.open ? 'open' : 'closed'}`}>
          <h3>Choose which columns to show...</h3>
          {this.props.columns
            .filter(column => column.toggleHidden)
            .map(column => {
              return (
                <div key={camelCase(column.Header)}>
                  {column.toggleHidden === true && (
                    <div>
                      <Checkbox
                        id={`data-table-column-selection-dropdown-checkbox-${column.accessor}`}
                        label={column.Header}
                        onChange={this._handleChange}
                        checked={typeof column.show === 'undefined' ? true : column.show}
                      />
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

ColumnSelection.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnSelectionChangeCallback: PropTypes.func.isRequired,
}

export default ColumnSelection
