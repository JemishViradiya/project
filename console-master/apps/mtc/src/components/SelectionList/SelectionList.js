import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

import CircularProgress from '@material-ui/core/CircularProgress'
import Radio from '@material-ui/core/Radio'
import Tooltip from '@material-ui/core/Tooltip'
import SearchIcon from '@material-ui/icons/Search'

import Checkbox from '../Checkbox'
import Text from '../Input/Text'

require('./SelectionList.scss')

class SelectionList extends Component {
  static defaultProps = {
    width: '300px',
    height: '300px',
    selectionType: 'none',
  }

  state = {
    filterQuery: '',
  }

  filterData = debounce(query => {
    // if async filter is enabled then request new data
    if (this.props.asyncFilter) {
      this.props.onFilterChange(query)
    } else {
      // if not enabled then save query and update data
      this.setState({
        filterQuery: query,
      })
      this.props.onSelectionChange(
        this.props.data.map(value => {
          const newValue = Object.assign({}, value)
          newValue.selected = false
          return newValue
        }),
      )
    }
  }, 500)

  handleFilterChange = event => {
    const query = event.target.value
    this.filterData(query)
  }

  handleSelectionChange = id => () => {
    const { selectionType } = this.props
    if (selectionType !== 'none') {
      this.props.onSelectionChange(id, selectionType)
    }
  }

  localFilter = (data, query) => {
    const lowerCasedQuery = query.toLowerCase()
    return data.filter(value => value.label && value.label.toLowerCase().includes(lowerCasedQuery))
  }

  render() {
    const { data, filter, loading, fullWidth, width, fullHeight, height, asyncFilter, selectionType, selected } = this.props
    const { filterQuery } = this.state
    const style = {
      width: fullWidth ? '100%' : width,
      height: fullHeight ? '100%' : height,
    }
    // local filtering if asyncFilter is not enabled
    const listItems = !asyncFilter ? this.localFilter(data, filterQuery) : data
    return (
      <div className="selection-list" style={style}>
        {filter && (
          <div className="selection-list-filter">
            <Text
              label="Filter"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              name="filter"
              fullWidth
              onChange={this.handleFilterChange}
              loading={loading}
              endAdornment={loading ? <CircularProgress size={20} /> : null}
              startAdornment={<SearchIcon />}
            />
          </div>
        )}
        <div className="selection-list-body">
          {listItems.length > 0 &&
            listItems.map(value => {
              const isSelected = selected.includes(value.id)
              return (
                <Tooltip title={value.label} placement="right" enterDelay={300} key={value.id}>
                  <div className={`selection-list-item ${isSelected ? 'selected' : ''}`} key={value.id}>
                    {selectionType === 'none' && <label className="no-selection-control">{value.label}</label>}
                    {selectionType === 'multiple' && (
                      <Checkbox
                        id={value.id}
                        label={value.label}
                        checked={isSelected}
                        onChange={this.handleSelectionChange(value.id)}
                      />
                    )}
                    {selectionType === 'single' && (
                      <div>
                        <Radio
                          checked={isSelected}
                          value={value.id}
                          id={value.id}
                          name="selection-list-radio"
                          onChange={this.handleSelectionChange(value.id)}
                        />
                        <label htmlFor={value.id}>{value.label}</label>
                      </div>
                    )}
                  </div>
                </Tooltip>
              )
            })}
          {listItems.length === 0 && <div className="selection-list-no-results">{this.props.t('selectionList.noResult')}</div>}
        </div>
      </div>
    )
  }
}

SelectionList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
  filter: PropTypes.bool,
  // async filter true = remote filter, async filter false = local filtering
  asyncFilter: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  width: PropTypes.string,
  fullHeight: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectionType: PropTypes.oneOf(['multiple', 'single', 'none']),
}

export default withTranslation()(SelectionList)
