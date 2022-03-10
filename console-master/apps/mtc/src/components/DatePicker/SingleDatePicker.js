import Moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { SingleDatePicker as ReactDatesSingleDatePicker } from 'react-dates'
import { OPEN_DOWN, OPEN_UP } from 'react-dates/constants'

class SingleDatePicker extends Component {
  state = {
    focused: false,
    date: null,
  }

  static getDerivedStateFromProps(props, state) {
    if (state.date === null && props.date !== null && typeof props.date !== 'undefined') {
      return {
        date: props.date,
      }
    }
    return null
  }

  handleDateChange = date => {
    this.setState(
      {
        date,
      },
      () => {
        this.props.onChange(date)
      },
    )
  }

  clear = () => {
    this.setState({
      date: null,
    })
  }

  render() {
    let { isOutsideRange } = this.props
    if (!isOutsideRange) {
      isOutsideRange = () => false
    }
    return (
      <ReactDatesSingleDatePicker
        placeholder="__/__/____"
        date={this.state.date}
        onDateChange={this.handleDateChange}
        focused={this.state.focused}
        onFocusChange={({ focused }) => this.setState({ focused })}
        id={this.props.id}
        disabled={this.props.disabled}
        numberOfMonths={1}
        isOutsideRange={isOutsideRange}
        openDirection={this.props.openUp ? OPEN_UP : OPEN_DOWN}
      />
    )
  }
}

SingleDatePicker.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func, // Used just to let the parent know what the updated values are
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment), PropTypes.string]),
  isOutsideRange: PropTypes.func,
}

export default SingleDatePicker
