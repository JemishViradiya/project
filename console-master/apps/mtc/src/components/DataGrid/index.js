import 'react-table/react-table.css'

import React from 'react'
import ReactTable from 'react-table'

require('./DataGrid.scss')

const DataGrid = ({ data, id, columns, loading, pageSize, sortCallback }) => {
  /* eslint-disable react/forbid-foreign-prop-types */
  delete ReactTable.propTypes.TableComponent
  delete ReactTable.propTypes.TheadComponent
  delete ReactTable.propTypes.TbodyComponent
  delete ReactTable.propTypes.TrGroupComponent
  delete ReactTable.propTypes.TrComponent
  delete ReactTable.propTypes.ThComponent
  delete ReactTable.propTypes.TdComponent
  delete ReactTable.propTypes.TfootComponent
  delete ReactTable.propTypes.FilterComponent
  delete ReactTable.propTypes.ExpanderComponent
  delete ReactTable.propTypes.PivotValueComponent
  delete ReactTable.propTypes.AggregatedComponent
  delete ReactTable.propTypes.PivotComponent
  delete ReactTable.propTypes.PaginationComponent
  delete ReactTable.propTypes.PreviousComponent
  delete ReactTable.propTypes.NextComponent
  delete ReactTable.propTypes.LoadingComponent
  delete ReactTable.propTypes.NoDataComponent
  delete ReactTable.propTypes.ResizerComponent
  delete ReactTable.propTypes.PadRowComponent
  /* eslint-enabled react/forbid-foreign-prop-types */
  return (
    <div id={id} className="data-grid">
      <ReactTable
        data={data}
        columns={columns}
        pageSize={pageSize}
        sortable
        onSortedChange={sortCallback}
        defaultSortMethod={(a, b, desc) => {
          if (desc) {
            return -1
          } else {
            return 1
          }
        }}
        showPagination={false}
        loading={loading}
      />
    </div>
  )
}

export default DataGrid
