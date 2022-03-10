import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React from 'react'

import DatePicker from './DatePicker'
import SelectType from './FilterSelect'
import Input from './Input'
import NumberInput from './numberInput'
import OptionsTypeSelect from './OptionTypeSelect'

require('./DataGridFilter.scss')

class DataGridFilter extends React.Component {
  state = {
    optionTypes: null,
    options: null,
    currentColumn: null,
    currentQuery: '',
  }

  componentDidMount() {
    // Creating a ref to child component so we can clear it's value
    this.datePickerChild = React.createRef()
  }

  componentWillReceiveProps(nextProps) {
    this._processColumns(nextProps)
  }

  _processColumns = nextProps => {
    let options = Object.assign({}, this.state.options)
    const optionTypes = {}
    options = nextProps.columnNames
      .filter(column => {
        return column.Header !== '' && column.filterable !== false && column.toggleHidden
      })
      .map(column => {
        optionTypes[column.accessor] = column.type ? column.type : 'text'
        if (column.type === 'enum') {
          optionTypes[column.accessor] = column.enumValues
        }
        return {
          value: column.accessor,
          text: column.Header,
          key: column.accessor,
        }
      })
    this.setState({
      optionTypes: optionTypes,
      options: options,
      currentColumn: this.state.currentColumn === null ? nextProps.initialFilterColumn : this.state.currentColumn,
    })
  }

  _fireQuery = debounce(() => {
    this.props.filterQueryChangeCallback(
      this.state.currentColumn,
      this.state.currentQuery,
      this.state.optionTypes[this.state.currentColumn],
    )
  }, 600)

  _handleColumnChange = (event, data) => {
    const { currentColumn, currentQuery } = this.state
    const { value } = data.props
    this.setState(
      {
        currentColumn: value,
        currentQuery: '',
      },
      () => {
        if (this.datePickerChild && this.datePickerChild.current) {
          this.datePickerChild.current.clear() // Call clear method on datepicker if column changes
        }
        if (currentColumn !== data.value && currentQuery !== '') {
          this._fireQuery()
        }
      },
    )
  }

  _handleDateChange = dateObject => {
    if (dateObject === null || dateObject.format('YYYY-MM-DD').length !== 10) {
      this.setState({
        currentQuery: '',
      })
    } else {
      this.setState({
        currentQuery: dateObject.format('YYYY-MM-DD'),
      })
    }
    this._fireQuery()
  }

  _handleQueryChange = value => {
    this.setState(
      {
        currentQuery: value,
      },
      () => {
        this._fireQuery()
      },
    )
  }

  render() {
    return (
      <div id="data-table-filter" className="table-filter">
        {this.state.options !== null && (
          <SelectType options={this.state.options} value={this.state.currentColumn} onChange={this._handleColumnChange} />
        )}
        {this.state.optionTypes !== null && this.state.optionTypes[this.state.currentColumn] === 'text' && (
          <Input
            placeholder="Quick filter"
            type={this.state.optionTypes !== null ? this.state.optionTypes[this.state.currentColumn] : 'text'}
            onChange={this._handleQueryChange}
            value={this.state.currentQuery}
          />
        )}
        {this.state.optionTypes !== null && this.state.optionTypes[this.state.currentColumn] === 'number' && (
          <NumberInput
            placeholder="Quick filter"
            type={this.state.optionTypes !== null ? this.state.optionTypes[this.state.currentColumn] : 'number'}
            onChange={this._handleQueryChange}
            value={this.state.currentQuery}
          />
        )}
        {this.state.optionTypes !== null && this.state.optionTypes[this.state.currentColumn] === 'date' && (
          <DatePicker onChange={this._handleDateChange} />
        )}

        {this.state.optionTypes !== null && typeof this.state.optionTypes[this.state.currentColumn] === 'object' && (
          <OptionsTypeSelect options={this.state.optionTypes[this.state.currentColumn]} onChange={this._handleQueryChange} />
        )}
      </div>
    )
  }
}

DataGridFilter.propTypes = {
  filterQueryChangeCallback: PropTypes.func.isRequired,
  columnNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialFilterColumn: PropTypes.string.isRequired,
}

export default DataGridFilter
