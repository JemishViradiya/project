import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DateRangePicker as ReactDatesDateRangePicker } from 'react-dates'

class DateRangePicker extends Component {
  state = {
    startDate: null,
    endDate: null,
    focusedInput: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {}
    if (prevState.startDate === null && nextProps.initialStartDate !== null) {
      newState.startDate = nextProps.initialStartDate
    }
    if (prevState.endDate === null && nextProps.initialEndDate !== null) {
      newState.endDate = nextProps.initialEndDate
    }

    if (Object.keys(newState).length !== 0) {
      return newState
    }

    return null
  }

  handleDateChange = ({ startDate, endDate }) => {
    this.setState(
      {
        startDate,
        endDate,
      },
      () => {
        this.props.onChange(startDate, endDate)
      },
    )
  }

  handleFocusChange = focusedInput => {
    this.setState({ focusedInput })
  }

  render() {
    let { isOutsideRange } = this.props
    if (!isOutsideRange) {
      isOutsideRange = () => false
    }
    return (
      <ReactDatesDateRangePicker
        startDate={this.state.startDate}
        startDateId={`${this.props.id}-startDate`}
        endDate={this.state.endDate}
        endDateId={`${this.props.id}-endDate`}
        onDatesChange={this.handleDateChange}
        focusedInput={this.state.focusedInput}
        onFocusChange={this.handleFocusChange}
        disabled={this.props.disabled}
        numberOfMonths={2}
        isOutsideRange={isOutsideRange}
      />
    )
  }
}

DateRangePicker.propTypes = {
  id: PropTypes.string, // ID is used to generate startDateId and endDateId
  disabled: PropTypes.bool,
  onChange: PropTypes.func, // Used just to let the parent know what the updated values are
  // Start and end date can be supplied as a moment object to initialize date range picker
  initialStartDate: PropTypes.object, // eslint-disable-line
  // Disabling lines because I don't want to write out the moment object and no types
  initialEndDate: PropTypes.object, // eslint-disable-line
  isOutsideRange: PropTypes.func,
}

export default DateRangePicker
