/*
	The <PartnerFilter /> component renders a select dropdown menu based on received props.
	Props:
        partnerQueryCallback - A callback function to update the partner state of the parent component based on the user selected option from the select dropdown menu.
            @option - partnerQueryCallback passes the user selected @option through the callback function.
        data - The data to be processed and passed in to the select dropdown menu.
        loading - A boolean indicator if the PartnerFilter is in a loading state.
        gridLoading - A boolean indicator if the parent DataGrid component is in a loading state.
*/
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import PartnerFilterAutocomplete from './partnerFilterAutocomplete'

require('./PartnerFilter.scss')

class PartnerFilter extends PureComponent {
  state = {
    value: null,
  }

  processData = data => {
    return data.listData.map(listItem => {
      return {
        value: listItem.id,
        label: listItem.name,
      }
    })
  }

  handleChange = (option, data) => {
    this.setState(
      {
        value: data,
      },
      () => {
        this.props.partnerQueryCallback(data)
      },
    )
  }

  render() {
    const { data, loading, gridLoading } = this.props
    const { value } = this.state
    let options = []
    let textDimensions = 300
    if (loading !== true && data !== null) {
      options = this.processData(data)
      const longestString = options.reduce((previousValue, currentValue) => {
        return previousValue.label.length > currentValue.label.length
          ? { label: previousValue.label }
          : { label: currentValue.label }
      }).label
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      textDimensions = ctx.measureText(longestString).width + 30
    }
    return (
      <div className="partner-filter" style={{ width: textDimensions }}>
        <PartnerFilterAutocomplete
          freeSolo
          options={options}
          onChange={this.handleChange}
          disabled={gridLoading || loading}
          isLoading={loading}
          value={value}
        />
      </div>
    )
  }
}

function allowNull(wrappedPropTypes) {
  return (props, propName, ...rest) => {
    if (props[propName] === null) return null
    return wrappedPropTypes(props, propName, ...rest)
  }
}

PartnerFilter.defaultProps = {
  data: null,
}

PartnerFilter.propTypes = {
  partnerQueryCallback: PropTypes.func.isRequired,
  data: allowNull(
    PropTypes.shape({
      listData: PropTypes.arrayOf(PropTypes.object).isRequired,
      totalCount: PropTypes.number.isRequired,
    }).isRequired,
  ),
  gridLoading: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
}

export default PartnerFilter
