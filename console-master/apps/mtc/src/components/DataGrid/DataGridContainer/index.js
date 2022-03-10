/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import { cloneDeep, isEmpty, isEqual, merge } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import DataGrid from '../'
import { setBulk, setChecked, setSelectAll, unsetBulk, unsetChecked, unsetSelectAll } from '../../../redux/dataGrid/actions'
import PartnerAPI from '../../../services/api/partnerAPI'
import Storage from '../../../Storage'
import either from '../../../utils/either'
import { CheckboxCell, CheckboxHeaderCell } from '../Cells'
import ColumnSelection from '../ColumnSelection'
import DataGridFilter from '../DataGridFilter'
import LimitSelection from '../LimitSelection'
import Pagination from '../Pagination'
import PartnerFilter from '../PartnerFilter'

export class DataGridContainer extends Component {
  state = {
    pagination: {
      limit: 10,
      offset: 0,
    },
    filter: {
      // eslint-disable-line react/no-unused-state
      filterQuery: null,
      filterColumn: null,
      filterOperator: null,
    },
    sort: {
      // eslint-disable-line react/no-unused-state
      sortColumn: null,
      sortDirection: null,
    },
    partner: {
      // eslint-disable-line react/no-unused-state
      partnerId: null,
    },
    partnerLoading: true,
    partnerData: null,
    data: null,
    visibleColumns: [],
    columns: [],
  }

  componentDidMount() {
    this.props.onParamChange(this.buildParams())
    if (Storage.checkPermission('partner:list') !== false) {
      this.fetchPartnerData()
    }
    const columns = this.checkForStoredColumns() || this.props.columns
    const visibleColumns = columns ? this.filterColumns(columns) : []

    if (this.props.checkboxColumn) {
      const id = this.props.id ? this.props.id : 'id'
      const checkColumn = {
        Cell: ({ original }) => {
          return <CheckboxCell checked={this.props.checked[original[id]] === true} onChange={() => this.toggleRow(original[id])} />
        },
        Header: () => {
          return <CheckboxHeaderCell selectAll={this.props.selectAll} onChange={() => this.toggleSelectAll()} />
        },
        toggleHidden: false,
        filterable: false,
        sortable: false,
        width: 65,
        resizable: false,
      }
      columns.unshift(checkColumn)
    }

    let limit = 10

    if (this.props.limit && this.props.limit > 10) {
      limit = this.props.limit // eslint-disable-line
    }

    const updatedColumns = columns.filter(item => item.featureFlag !== false)

    this.setState({
      visibleColumns: visibleColumns,
      columns: updatedColumns,
      data: this.props.data ? this.props.data.listData : null,
      pagination: {
        limit: limit,
        offset: 0,
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps
    const columns = this.checkForStoredColumns() || this.props.columns
    const visibleColumns = columns ? this.filterColumns(columns) : []

    if (data && !isEqual(data.listData, this.state.data)) {
      this.setState({
        data: data.listData,
      })
    }

    if (this.props.checkboxColumn) {
      const id = this.props.id ? this.props.id : 'id'
      const checkPermission = this.props.checkboxPermission ? Storage.checkPermission(this.props.checkboxPermission) : true
      if (checkPermission) {
        const checkColumn = {
          Cell: ({ original }) => {
            return (
              <CheckboxCell checked={this.props.checked[original[id]] === true} onChange={() => this.toggleRow(original[id])} />
            )
          },
          Header: () => {
            return <CheckboxHeaderCell selectAll={this.props.selectAll} onChange={() => this.toggleSelectAll()} />
          },
          toggleHidden: false,
          filterable: false,
          sortable: false,
          width: 65,
          resizable: false,
        }
        columns.unshift(checkColumn)
      }
    }

    const updatedColumns = columns.filter(item => item.featureFlag !== false)

    this.setState({
      visibleColumns: visibleColumns,
      columns: updatedColumns,
    })
    if (nextProps.limit && nextProps.limit > 10 && nextProps.limit !== this.state.limit) {
      const {
        pagination: { offset },
      } = this.state
      this.setState({
        pagination: {
          offset,
          limit: nextProps.limit,
        },
      })
    }
  }

  componentWillUnmount() {
    this.props.unsetBulk()
    this.props.unsetChecked()
    this.props.unsetSelectAll()
  }

  filterColumns = columns => {
    return columns.filter(column => {
      if (typeof column.show === 'undefined') {
        return true
      } else {
        return column.show
      }
    })
  }

  checkForStoredColumns() {
    const storedCols = Storage.getVisibleColumns(this.props.storedColumnKey)
    const { columns } = this.props
    let newCols = null
    // If there are stored columns, map over the current columns and change
    // the "show" attribute to "true" for each current column that was stored.
    if (storedCols) {
      newCols = columns.map((...args) => {
        const [opts] = args
        const colIndex = storedCols.indexOf(opts.accessor)
        if (colIndex > -1 || !opts.accessor) {
          opts.show = true
          if (typeof opts.permission !== 'undefined' && !opts.permission) {
            opts.show = false
          }
        } else {
          opts.show = false
        }
        return opts
      })
    }
    return newCols
  }

  toggleRow = id => {
    const newSelected = Object.assign({}, this.props.checked)
    let selectAll = 2

    if (typeof newSelected[id] !== 'undefined') {
      delete newSelected[id]
    } else {
      newSelected[id] = true
    }
    if (Object.keys(newSelected).length === this.state.data.length) {
      selectAll = 1
    } else if (Object.keys(newSelected).length === 0) {
      selectAll = 0
    }
    if (this.props.bulkSelected) {
      this.props.unsetBulk()
    }

    this.props.setChecked(newSelected)
    this.props.setSelectAll(selectAll)
  }

  toggleSelectAll = () => {
    const newSelected = {}
    const id = this.props.id ? this.props.id : 'id'

    if (this.props.selectAll === 0) {
      this.props.data.listData.forEach(value => {
        newSelected[value[id]] = true
      })
    }

    this.props.setChecked(newSelected)
    this.props.setSelectAll(this.props.selectAll === 0 ? 1 : 0)
  }

  toggleBulkSelectAll = () => {
    if (this.props.bulkSelected) {
      this.props.unsetBulk()
    } else {
      this.props.setBulk()
    }
    if (this.props.selectAll === 3) {
      this.props.unsetChecked()
    }
    this.props.setSelectAll(this.props.selectAll === 1 ? 3 : 0)
  }

  resetCheckedColumns = () => {
    this.props.unsetSelectAll()
    this.props.unsetChecked()
    this.props.unsetBulk()
  }

  fetchPartnerData = async () => {
    let mounted = true
    this.setState({ partnerLoading: true })
    const [error, res] = await either(PartnerAPI.getPartnersList())
    if (error) {
      // this.props.logger.logError('GET Partner List DataGrid Filter Failed', error);
    } else if (mounted) {
      this.setState({
        partnerData: res.data,
        partnerLoading: false,
      })
    }

    return () => (mounted = false)
  }

  updatePagination = offset => {
    this.setState(
      prevState => {
        const pagination = Object.assign({}, prevState.pagination)
        pagination.offset = offset
        return {
          pagination: pagination,
        }
      },
      () => {
        this.props.onParamChange(this.buildParams())
        this.resetCheckedColumns()
      },
    )
  }

  updateFilter = (filterColumn, filterQuery, filterType) => {
    this.setState(
      prevState => {
        const filter = Object.assign({}, prevState.filter)
        const pagination = Object.assign({}, prevState.pagination)
        pagination.offset = 0
        filter.filterQuery = !filterQuery ? null : filterQuery
        filter.filterColumn = !filterQuery ? null : filterColumn
        const type = filterType === 'text' ? 'contains' : 'isEqual'
        filter.filterOperator = !filterQuery ? null : type
        return {
          filter: filter,
          pagination: pagination,
        }
      },
      () => {
        this.props.onParamChange(this.buildParams())
        this.resetCheckedColumns()
      },
    )
  }

  updateSort = newSorted => {
    if (newSorted[0] === null) {
      this.setState(
        prevState => {
          const sort = Object.assign({}, prevState.sort)
          sort.sortColumn = null
          sort.sortDirection = null
          return {
            sort: sort,
          }
        },
        () => {
          this.props.onParamChange(this.buildParams())
          this.resetCheckedColumns()
        },
      )
    } else {
      const { desc, id } = newSorted[0]
      this.setState(
        prevState => {
          const sort = Object.assign({}, prevState.sort)
          sort.sortColumn = id
          sort.sortDirection = desc ? 'desc' : 'asc'
          return {
            sort: sort,
          }
        },
        () => {
          this.props.onParamChange(this.buildParams())
          this.resetCheckedColumns()
        },
      )
    }
  }

  updateLimit = (event, option) => {
    const limit = option.props.value
    this.setState(
      prevState => {
        const pagination = Object.assign({}, prevState.pagination)
        pagination.limit = limit
        pagination.offset = 0
        return {
          pagination: pagination,
        }
      },
      () => {
        this.props.onParamChange(this.buildParams())
        this.resetCheckedColumns()
      },
    )
  }

  updatePartner = option => {
    let query = null
    if (option !== null) {
      query = option.value
    }
    this.setState(
      prevState => {
        const partner = Object.assign({}, prevState.partner)
        const pagination = Object.assign({}, prevState.pagination)
        partner.partnerId = query
        pagination.offset = 0
        return {
          partner: partner,
          pagination: pagination,
        }
      },
      () => {
        this.props.onParamChange(this.buildParams())
        this.resetCheckedColumns()
      },
    )
  }

  updateColumnSelectionChange = (label, isChecked) => {
    const columns = this.state.columns.splice(0)
    const columnMatchIndex = columns.findIndex(column => column.Header === label)
    columns[columnMatchIndex].show = isChecked
    const visibleColumns = this.filterColumns(columns)
    const visibleColArray = visibleColumns.filter(column => column.accessor).map(col => col.accessor)
    Storage.setVisibleColumns(this.props.storedColumnKey, visibleColArray)
    this.setState({
      columns: columns,
      visibleColumns: visibleColumns,
    })
  }

  buildParams = () => {
    const { pagination, filter, sort, partner } = cloneDeep(this.state)
    return merge(pagination, filter, sort, partner)
  }

  render() {
    const {
      data,
      loading,
      button,
      partnerFilter,
      buttonPermission,
      hideFilter,
      noPagination,
      bulkSelectAll,
      checked,
      selectAll,
      message,
    } = this.props
    const { pagination, columns, visibleColumns } = this.state
    const totalCount = isEmpty(data) ? null : data.totalCount

    if (columns !== null) {
      return [
        <div className="data-grid-utility" key="data-grid-utility">
          <div className="dgu-left-container">
            {Storage.checkPermission(buttonPermission) && button}
            {visibleColumns.length > 0 && !hideFilter && (
              <DataGridFilter
                filterQueryChangeCallback={this.updateFilter}
                columnNames={visibleColumns}
                initialFilterColumn={visibleColumns[0].accessor}
              />
            )}
            {Storage.checkPermission('partner:list') && partnerFilter !== false && (
              <PartnerFilter
                partnerQueryCallback={this.updatePartner}
                data={this.state.partnerData}
                loading={this.state.partnerLoading}
                gridLoading={loading}
              />
            )}
          </div>
          <div className="dgu-right-container">
            {message !== undefined && <p className="utility-message">{message}</p>}
            {(typeof this.props.columnSelection === 'undefined' || this.props.columnSelection) && (
              <ColumnSelection columns={columns} columnSelectionChangeCallback={this.updateColumnSelectionChange} />
            )}
          </div>
        </div>,
        <div className="data-grid-container" key="data-grid-container">
          <div className="bulk-select-all-container">
            {bulkSelectAll && selectAll === 1 && totalCount > 0 && (
              <div className="bulk-select-all-select">
                {totalCount > 1 ? (
                  <div>
                    <p>{Object.keys(checked).length} items on this page are selected.</p>
                    <p className="bulk-select-all-link" onClick={this.toggleBulkSelectAll}>
                      {' '}
                      Select all {totalCount} items.
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
            {selectAll === 3 && (
              <div className="bulk-select-all-select">
                <p>All {totalCount} items are selected.</p>
                <p className="bulk-select-all-link" onClick={this.toggleBulkSelectAll}>
                  {' '}
                  Clear selection.
                </p>
              </div>
            )}
          </div>
          <DataGrid
            columns={columns}
            data={this.state.data ? this.state.data : []}
            loading={loading}
            totalCount={totalCount}
            pageSize={pagination.limit}
            sortCallback={this.updateSort}
          />
          {!noPagination && (
            <Pagination
              limit={pagination.limit}
              totalCount={totalCount}
              offset={pagination.offset}
              pageChangeCallback={this.updatePagination}
            />
          )}
          <div className="right-footer-container">
            <div className="total-items">
              {totalCount || 0} total item{totalCount === 1 ? '' : 's'}
            </div>
            {!noPagination && <LimitSelection limitChangeCallback={this.updateLimit} />}
          </div>
        </div>,
      ]
    } else {
      return <div />
    }
  }
}

const mapStateToProps = state => ({
  bulkSelected: state['data-grid'].bulkSelectAll,
  checked: state['data-grid'].checked,
  selectAll: state['data-grid'].selectAll,
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setBulk: setBulk,
      setChecked: setChecked,
      setSelectAll: setSelectAll,
      unsetBulk: unsetBulk,
      unsetChecked: unsetChecked,
      unsetSelectAll,
    },
    dispatch,
  )
}

DataGridContainer.defaultProps = {
  checkboxPermission: null,
}

DataGridContainer.propTypes = {
  button: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  buttonPermission: PropTypes.string,
  bulkSelectAll: PropTypes.bool,
  checkboxColumn: PropTypes.bool,
  checkboxPermission: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.shape({
    listData: PropTypes.array,
    totalCount: PropTypes.number,
  }),
  hideFilter: PropTypes.bool,
  loading: PropTypes.bool,
  message: PropTypes.string,
  onParamChange: PropTypes.func,
  storedColumnKey: PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(DataGridContainer)
