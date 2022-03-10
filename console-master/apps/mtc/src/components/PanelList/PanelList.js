import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { PanelListView } from './'

class PanelList extends PureComponent {
  state = {
    data: null,
    totalMatches: null,
    filterQuery: '',
    offset: 0,
    limit: 30,
    filterColumn: 'name',
    filterOperator: 'contains',
  }

  componentDidUpdate({ data, totalMatches }) {
    let { limit } = this.state
    const initializingData = data && data.length === limit && this.state.data === null
    if (initializingData) {
      limit = totalMatches
    }
    this.setState(
      {
        data: data,
        totalMatches: totalMatches,
        limit: limit,
      },
      () => {
        if (initializingData) {
          this.fetch()
        }
      },
    )
  }

  componentDidMount() {
    if (this.props.data === null) {
      this.fetch()
    } else {
      this.setState({
        data: this.props.data,
        totalMatches: this.props.totalMatches,
      })
    }
  }

  fetch = () => {
    const { offset, filterQuery, filterColumn, limit, filterOperator } = this.state
    if (this.props.minFilter && this.props.minFilter > filterQuery.length) {
      return
    }
    this.props.fetchData({
      offset,
      filterQuery,
      filterColumn,
      limit,
      filterOperator,
    })
  }

  handleFilter = value => {
    this.setState(
      {
        filterQuery: value,
        offset: 0,
      },
      this.fetch,
    )
  }

  render() {
    return (
      <PanelListView
        position={this.props.position}
        resource={this.props.resource}
        filter={this.props.filter}
        minFilter={!!this.props.minFilter}
        minFilterMet={this.props.minFilter && this.props.minFilter <= this.state.filterQuery.length}
        onFilter={this.handleFilter}
        noResultsMessage={this.props.noResultsMessage}
        data={this.state.data}
        totalMatches={this.state.totalMatches}
        rowTemplate={this.props.rowTemplate}
        loading={this.props.loading}
        disabledRows={this.props.disabledRows}
        rowHeight={this.props.rowHeight}
      />
    )
  }
}

PanelList.propTypes = {
  position: PropTypes.oneOf(['centered', 'inline']),
  data: PropTypes.arrayOf(PropTypes.object),
  noResultsMessage: PropTypes.string, // Overloads the no results message
  totalMatches: PropTypes.number,
  loading: PropTypes.bool,
  fetchData: PropTypes.func, // A function that fetches data
  resource: PropTypes.string, // tenant, partner, etc.
  disabledRows: PropTypes.arrayOf(PropTypes.string), // array of tenant id's
  minFilter: PropTypes.number, // Min filter query length before request will be made
  minFilterMet: PropTypes.bool,
  rowTemplate: PropTypes.arrayOf(PropTypes.func), // Array of functions that have rowData passed in
}

export default PanelList
